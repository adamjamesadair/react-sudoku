import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
var _ = require('lodash');

Array.prototype.diff = function(a) {
  return this.filter(function(i) {
    return a.indexOf(i) < 0;
  });
};

function indexToCoord(i) {}

function coordToPosition(coord) {}

function getNeighbours(coords, squares) {
  let neighbours = [];
  // Row and column neighbours
  for (let i = 0; i < 9; i++) {
    neighbours.push(squares[coords[0]][i]);
    neighbours.push(squares[i][coords[1]]);
  }

  // Same block neighbours
  let iBlockStart = Math.floor(coords[0] / 3) * 3;
  let jBlockStart = Math.floor(coords[1] / 3) * 3;

  for (let j = iBlockStart; j < iBlockStart + 3; j++) {
    for (let k = jBlockStart; k < jBlockStart + 3; k++) {
      neighbours.push(squares[j][k]);
    }
  }
  return neighbours;
}

function getSquareValue(coords, squares) {
  let options = Array.from(Array(9).keys());
  let [i, j] = coords;
  let neighbours = getNeighbours(coords, squares);
  return (_.sample(options.diff(neighbours)));
}

function generateStartingValues(n) {
  let squares = new Array(9).fill().map(() => Array(9).fill(''));
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      squares[i][j] = getSquareValue([
        i, j
      ], squares);
    }
  }
  console.log(squares);
  // TODO Return convert to positions
  return Array(81).fill('');
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
