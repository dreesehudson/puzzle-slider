import React, { Component } from 'react';
import Header from './Components/Header.js'
import 'bootstrap/dist/css/bootstrap.css';
import { Container, Row, Col, Button } from 'reactstrap';


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // image: "",
      gridWidth: 4, //sets width of game board and governs number of tiles created on page load
      displayGrid: [],
      tiles: [
        //landing spot for tile objects
      ]
    }
    this.shuffleButtonHandler = this.shuffleButtonHandler.bind(this)
    this.tileClickHandler = this.tileClickHandler.bind(this)
    this.switchTiles = this.switchTiles.bind(this)
  }

  //onload create initial tile array
  componentDidMount() {
    this.createTiles(this.state.gridWidth * this.state.gridWidth);

  }

  componentDidUpdate() {
    //populate state.gridDisplay
  }

  createTiles(num) {
    //temp variables to construct tile components for state
    let _array = []
    let _col = 0;
    let _row = 0;
    let _display = 0;

    for (let idx = 0; idx < num; idx++) {
      //create temporary tile object with basic attributes
      _col = idx % this.state.gridWidth;
      _row = idx - (idx % this.state.gridWidth);
      _display = (idx + 1).toString()

      let _tile = {
        adjacent: false,      //if i+-1 || j+-gridWidth to the blank tile = true, else false
        display: _display,    //fixed, does not change, displayed on UI
        i: _col,              //malleable, identifies which column the tile is in currently
        j: _row,              //malleable, identifies which row the tile is in currently
        currPos: _col + _row, //malleable, changed by switch function when tile is moved on UI
        winPos: _col + _row,  //fixed, does not change
        blank: false          //<- assigned true to last index, else false
      }
      // push tile into proxy array
      _array.push(_tile)
    }

    //after all tiles have been created
    //set blank tile true to last tile
    _array[_array.length - 1].blank = true;
    _array[_array.length - 1].display = "";

    //assign initial adjacent status' to id: max - 1 and id: max - gridWidth
    this.assignAdjacent(_array);

    // console.log(_array);
    this.setState({ tiles: _array })
  };

  assignAdjacent(_tiles) {
    //clear out previous adjacent trues so that this iteration can correctly assign
    _tiles.map((item) => {
      return (item.adjacent = false)
    })

    //find currPos of blankTile
    let _blankCol = _tiles[(this.state.gridWidth * this.state.gridWidth) - 1].i //gridWidth squared -1 will always give the last item of the tile array
    let _blankRow = _tiles[(this.state.gridWidth * this.state.gridWidth) - 1].j //gridWidth squared -1 will always give the last item of the tile array

    //calculate positions of potential adjacents
    let _left = [_blankCol - 1, _blankRow];
    let _right = [_blankCol + 1, _blankRow];
    let _up = [_blankCol, _blankRow - this.state.gridWidth];
    let _down = [_blankCol, _blankRow + this.state.gridWidth];

    //gather potential adjacents to be mapped
    let _adjacents = [_down, _right, _left, _up]

    //find which tiles are at adj coords and toggle property to true
    _adjacents.map((item) => {
      //determine if that direction is on the board
      if ((item[0] >= 0 && item[0] < this.state.gridWidth) && (item[1] >= 0 && item[1] < this.state.gridWidth * this.state.gridWidth)) {
        //go through each tile and assign that tile's adjacent prop to true, else false.
        for (let n = 0; n < _tiles.length; n++) {
          if (_tiles[n].i == item[0] && _tiles[n].j == item[1]) {
            _tiles[n].adjacent = true;
            break;
          };
        }
      }
    })
    return _tiles
  };

  populateGrid() {
    let _gridArray = []
    // console.log(this.state.tiles.filter((item) => item.currPos === 2))
    for (let _i = 0; _i < this.state.gridWidth * this.state.gridWidth; _i++) {
      const foo = this.state.tiles.filter((item) => item.currPos === _i)
      const bar = foo[0];
      //console.log(typeof bar)
      _gridArray.push(bar.display)
    }
    //console.log([..._gridArray])
    this.setState({ displayGrid: _gridArray })
  }
  
  shuffleButtonHandler() {
    //console.log("shuffle")
    this.shuffleBoard()
    this.populateGrid()
    //onclick run shuffleBoard
  }
  
  shuffleBoard() {
    //program to perform 200 random valid moves,
    //artificialMove(numberOfMoves)
    //loop(numberOfMoves)
    //adjacent [ id's of tiles with adjacent: true]
    //Math.random * adjacent.length to pick which adjacent to "play"
    //switchTiles(artificialClickTile, blankTilePos) 
  }
  
  tileClickHandler(e) {
    //console.log(e);

    console.log(`clicked on ${e.target.textContent}`);
    const _element = this.state.tiles.filter((item) => 
      (item.display === e.target.textContent)
    );
    this.switchTiles(..._element)
    //this.checkWin()
  }

  async switchTiles(clickedTileObj) {
    //if clicked adjacent prop = true
    if (clickedTileObj.adjacent){
      console.log("valid move, swap with blank")
      //holder arrays to copy both of the positions and prevent accidental overwrites
      let newClickedPos = [this.state.tiles[(this.state.gridWidth * this.state.gridWidth)-1].i, this.state.tiles[(this.state.gridWidth * this.state.gridWidth)-1].j]
      let newBlankPos = [clickedTileObj.i, clickedTileObj.j]

      //console.log({ newClickedPos, newBlankPos })

      //copy whole tiles state
      let _proxy = this.state.tiles;

      //reassign coordinates to new positions
      clickedTileObj.i = newClickedPos[0]; 
      clickedTileObj.j = newClickedPos[1]; 
      clickedTileObj.currPos = clickedTileObj.i + clickedTileObj.j
      //console.log({ clickedTileObj });
      
      //reassign coordinates to new positions
      _proxy[this.state.gridWidth*this.state.gridWidth-1].i = newBlankPos[0];
      _proxy[this.state.gridWidth*this.state.gridWidth-1].j = newBlankPos[1];
      _proxy[this.state.gridWidth*this.state.gridWidth-1].currPos = _proxy[this.state.gridWidth*this.state.gridWidth-1].i + _proxy[this.state.gridWidth*this.state.gridWidth-1].j

      
      this.assignAdjacent(_proxy)

      //setState with new positions
      this.setState(
        ({tiles: _proxy})
      )

      await this.populateGrid()
      
      this.checkWin()
    }
    //else do nothing, not a valid move
    //else{ console.log("not valid move, try different tile")}
  }

  checkWin() {
    //loop through tiles object and  array.every()
    let _array = this.state.tiles.map((item) => {
      //compare currPos to winPos for each object return true/false
      return(item.currPos === item.winPos)
    });
    //filter temp array to keep only false elements
    _array = _array.filter((item) => item === false)
    //if the filtered array has no false values, then the board is correct and you have won
    if (_array.length === 0){
      console.log("WINNER")
    }
  }



  render() {
    return (
      <>
        <Header
          shuffleButtonHandler={this.shuffleButtonHandler}
        />
        <Container>
          <Row
            className="mt-3 mb-5">
            {this.state.displayGrid.map((item, idx) => {
              return (
                <Col sm={(12 / this.state.gridWidth)}>
                  <Button 
                    key={idx} 
                    style={{"height": "150px", "width": "150px"}} 
                    className={`btn bg-light text-dark ${item.adjacent ? "bg-dark" : ""}`}
                    onClick={this.tileClickHandler}
                    >
                    <h2>{item}</h2>
                  </Button>
                </Col>
              )
            })}
          </Row>
        </Container>
      </>
    );
  }
}

export default App
