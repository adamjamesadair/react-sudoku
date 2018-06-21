import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function getNeighbours(square, squares){

}

function fillSquare(square, squares){

}

function generateStartingValues(n){

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
      squares: Array(81).fill('')
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
    this.setState({
      squares: squares
    });
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
