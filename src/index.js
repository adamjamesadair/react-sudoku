import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
var _ = require('lodash');

// Array.prototype.diff = function(a) {
//   return this.filter(function(i) {
//     return a.indexOf(i) < 0;
//   });
// };

function getCell(x, y, cells) {
  return (cells.filter(function(cell) {
    return (cell.coords[0] === x && cell.coords[1] === y)
  })[0]);
}

function getNeighbours(coords, cells) {
  let neighbours = [];
  // Row and column neighbours
  for (let i = 0; i < 9; i++) {
    let col = getCell(coords[0], i, cells);
    let row = getCell(i, coords[1], cells);
    if (col)
      neighbours.push(col.value);
    if (row)
      neighbours.push(row.value);
    }

  // Same block neighbours
  let iBlockStart = Math.floor(coords[0] / 3) * 3;
  let jBlockStart = Math.floor(coords[1] / 3) * 3;

  for (let j = iBlockStart; j < iBlockStart + 3; j++) {
    for (let k = jBlockStart; k < jBlockStart + 3; k++) {
      let block = getCell(j, k, cells);
      if (block)
        neighbours.push(block.value);
      }
    }
  return neighbours;
}

// function getCellValue(cell, cells) {
//   return new Promise(function(resolve) {
//     let options = Array.from(Array(9).keys());
//     let neighbours = getNeighbours(cell.coords, cells);
//     resolve(_.sample(options.diff(neighbours)));
//   });
// }

function fillCellsWrapper(cells) {
  let emptyCells = cells.slice();
  fillCells(emptyCells, cells);
}

function fillCells(emptyCells, cells) {
  let cell = emptyCells.shift();
  let neighbours = getNeighbours(cell.coords, cells);
  let options = _.difference(Array.from(Array(9).keys()), neighbours);
  for (let option of _.shuffle(options)) {
    //getCell(cell.coords[0], cell.coords[1], cells).value = 5;
    cell.value = option;
    if (emptyCells.length === 0) {
      return true;
    }

    if (fillCells(emptyCells, cells)) {
      return true;
    }
  }

  cell.value = '';
  emptyCells.unshift(cell);
  return false;

  // let chain = Promise.resolve();
  // emptyCells.forEach((cell) => {
  //   chain = chain.then(() => getCellValue(cell, emptyCells).then((cellValue) => {
  //     cell.value = cellValue;
  //   }));
  //});

}

function generateStartingValues(n) {
  let cells = [];
  // init squares
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      cells.push(new Cell([i, j]));
    }
  }

  fillCellsWrapper(cells);
  console.log(cells);
  // TODO Return convert to positions
  return Array(81).fill('');
}

class Cell {
  constructor(coords) {
    this.coords = coords;
    this.value = '';
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
      squares: generateStartingValues(1)
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
