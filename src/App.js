import React, { Component } from 'react';
import Header from './Components/Header.js'
import Board from './Components/Board.js'
import 'bootstrap/dist/css/bootstrap.css';


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // image: "",
      gridWidth: 3, //sets width of game board and governs number of tiles created on page load
      tiles: [
        //landing spot for tile objects
      ]
    }
    //functions passed down as props, binded so they reference App's state, not the child's state
    this.shuffleButtonHandler = this.shuffleButtonHandler.bind(this);
    this.tileClickHandler = this.tileClickHandler.bind(this);
  }


  //onload create initial tile array
  componentDidMount() {
    this.createTiles(this.state.gridWidth * this.state.gridWidth);
  }

  componentDidUpdate() {
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
      _display = idx + 1

      let _tile = {
        display: _display,    //fixed, does not change, displayed on UI
        i: _col,              //malleable, identifies which column the tile is in currently
        j: _row,              //malleable, identifies which row the tile is in currently
        currPos: _col + _row, //malleable, changed by switch function when tile is moved on UI
        winPos: _col + _row,  //fixed, does not change
        adjacent: false,      //if i+-1 || j+-gridWidth to the blank tile = true, else false
        blank: false          //<- assigned true to last index, else false
      }
      // push tile into proxy array
      _array.push(_tile)
    }

    //after all tiles have been created
    //set blank tile true to last tile
    _array[_array.length - 1].blank = true;

    //assign initial adjacent status' to id: max - 1 and id: max - gridWidth
    this.assignAdjacent(_array);

    // console.log(_array);
    this.setState({ tiles: _array })
  };

  assignAdjacent(_tiles) {
    //clear out previous adjacent trues so that this iteration can correctly assign
    _tiles.map((item) => {
      return(item.adjacent = false)
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
      if ((item[0] > 0 && item[0] < this.state.gridWidth) && (item[1] > 0 && item[1] < this.state.gridWidth * this.state.gridWidth)) {
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
  }

  shuffleButtonHandler() {
    console.log("shuffle")
    //onclick run shuffleBoard
  }

  shuffleBoard() {
    //setState this.state.playerMoves = 0
    //program to perform 200 random valid moves,
    //artificialMove(numberOfMoves)
    //loop(numberOfMoves)
    //adjacent [ id's of tiles with adjacent: true]
    //Math.random * adjacent.length to pick which adjacent to "play"
    //switchTiles(artificialClickTile, blankTilePos) 
  }

  tileClickHandler(e) {
    console.log("playerSwitch")
    //this.switchTiles(e.target, blankTilePos)
    //setState playerMove ++ 
    //this.checkWin
  }

  switchTiles(clickedTilePos, blankTilePos) {
    //if clicked adjacent prop = true
      //holder array to copy both of the positions 
      //assign clickedTilePos to holder's copy of blankTilePos
      //assign blankTilePos to holder's copy of clickedTilePos
      //assignAdjacents()
      //setState with new positions

    // }
    //else do nothing, not a valid move
  }

  checkWin() {
    //loop through tiles object and compare currPos to index
    //if false kickout
    //if true continue to next iteration, if all true player has won
  }



  render() {
    return (
      <>
        <Header
          shuffleButtonHandler={this.shuffleButtonHandler}
        />
        <Board
          gridWidth={this.state.gridWidth}
          tiles={this.state.tiles}
          tileClickHandler={this.tileClickHandler}
        />
      </>
    );
  }
}

export default App
