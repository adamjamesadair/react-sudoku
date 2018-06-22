import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
var _ = require('lodash');

function getCell(x, y, cells) {
  return (cells.filter(function(cell) {
    return (cell.coords[0] === x && cell.coords[1] === y)
  })[0]);
}

function getNeighbours(coords, cells) {
  let neighbours = [];
  // Row and column neighbours
  for (let i = 0; i < 9; i++) {
    if (i !== coords[1])
      neighbours.push(getCell(coords[0], i, cells).value);
    if (i !== coords[0])
      neighbours.push(getCell(i, coords[1], cells).value);
    }

  // Same block neighbours
  let iBlockStart = Math.floor(coords[0] / 3) * 3;
  let jBlockStart = Math.floor(coords[1] / 3) * 3;

  for (let j = iBlockStart; j < iBlockStart + 3; j++) {
    for (let k = jBlockStart; k < jBlockStart + 3; k++) {
      if (j !== coords[0] || k !== coords[1])
        neighbours.push(getCell(j, k, cells).value);
      }
    }
  return neighbours;
}

function fillCells(cells) {
  let remainingCells = cells.slice();
  generateCellValues(remainingCells, cells);
}

function generateCellValues(remainingCells, cells) {
  let cell = remainingCells.shift();
  let neighbours = getNeighbours(cell.coords, cells);
  let options = _.difference(_.range(1, 10), neighbours);
  for (let option of _.shuffle(options)) {
    //if (!cell.initial)
    cell.value = option;
    if (remainingCells.length === 0) {
      return true;
    }

    if (generateCellValues(remainingCells, cells)) {
      return true;
    }
  }

  cell.value = '';
  remainingCells.unshift(cell);
  return false;
}

function elementsToPositions(elements) {
  let list = [];
  let index;

  for (let t = 0; t < 3; t++) {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        for (let k = 0; k < 3; k++) {
          index = 27 * t + i * 3 + j * 9 + k;
          if (elements[0] instanceof Cell) {
            list.push(elements[index].value);
          } else {
            list.push(elements[index]);
          }
        }
      }
    }
  }
  return list;
}

function solve(board) {
  let cells = initCells();
  board = elementsToPositions(board);
  cells.forEach((cell, i) => {
    cell.value = board[i];
    if (board[i])
      cell.initial = true;
    }
  );
  fillCells(cells);
  return elementsToPositions(cells);
}

function initCells() {
  let cells = [];
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      cells.push(new Cell([i, j]));
    }
  }
  return cells;
}

function generateStartingBoard(n) {
  let cells = initCells();
  fillCells(cells);
  let sudoku = elementsToPositions(cells);
  let board = Array(81).fill('');
  _.shuffle(_.range(81)).slice(81 - n).forEach((i) => {
    board[i] = sudoku[i];
  });

  if (solve(board).includes(''))
    console.log('unsolvable');

  return board;
}

class Cell {
  constructor(coords, value = '', initial = false) {
    this.coords = coords;
    this.value = value;
    this.initial = initial;
  }
}

class Square extends React.Component {
  render() {
    return (<input value={this.props.value} type="text" pattern="[1-9]" maxLength="1" className="square" onChange={this.props.onChange} onKeyDown={this.props.onKeyDown}/>);
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: generateStartingBoard(17)
    };
  }

  handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.target.blur();
    }
  }

  handleSubmit(e, i) {
    const squares = this.state.squares.slice();
    squares[i] = e.target.value;
    this.setState({squares: squares});
  }

  createBoard() {
    let board = [];
    let row;
    let block;
    // Generate blocks
    for (let i = 0; i < 9; i++) {
      block = [];
      for (let j = 0; j < 3; j++) {
        row = [];
        for (let k = 0; k < 3; k++) {
          row.push(this.renderSquare(i * 9 + j * 3 + k));
        }
        block.push(<div className="row" key={j}>{row}</div>);
      }
      board.push(<div className="block" key={i}>{block}</div>);
    }
    return (board);
  }

  renderSquare(i) {
    return (<Square value={this.state.squares[i]} key={i} onKeyDown={this.handleKeyPress} onChange={(e) => this.handleSubmit(e, i)}/>);
  }

  render() {
    return (this.createBoard());
  }
}

class Game extends React.Component {
  render() {
    return (<div className="game">
      <div className="game-board">
        <Board/>
      </div>
    </div>);
  }
}

ReactDOM.render(<Game/>, document.getElementById('root'));
