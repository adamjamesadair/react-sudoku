import React from 'react';
import ReactDOM from 'react-dom';
import * as sg from './sudokuGenerator.js';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import {FormGroup, ControlLabel, FormControl, Button} from 'react-bootstrap';

class Square extends React.Component {
  render() {
    return (<input value={this.props.value} type="text" disabled={this.props.disabled} pattern="[1-9]" maxLength="1" className={this.props.className} onChange={this.props.onChange} onKeyDown={this.props.onKeyDown}/>);
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    let startingBoard = sg.generateStartingBoard(this.props.initial);
    this.state = {
      squares: startingBoard
    };
    this.initialSquares = startingBoard.map((cell) => cell !== '');
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
        block.push(<div className="board-row" key={j}>{row}</div>);
      }
      board.push(<div className="block" key={i}>{block}</div>);
    }
    return (board);
  }

  renderSquare(i) {
    let className = "square";
    let disabled = false;
    if (this.initialSquares[i]) {
      className += " initial";
      disabled = true;
    }

    return (<Square value={this.state.squares[i]} disabled={disabled} className={className} key={i} onKeyDown={this.handleKeyPress} onChange={(e) => this.handleSubmit(e, i)}/>);
  }

  render() {
    return (this.createBoard());
  }
}

class Menu extends React.Component {
  render() {
    return (<form>
      <FormGroup controlId="formControlsSelect">
        <ControlLabel>Initial cells</ControlLabel>
        <FormControl componentClass="select" placeholder="select">
          <option value="select">17 - Extreme</option>
          <option value="select">26 - Hard</option>
          <option value="select">33 - Medium</option>
          <option value="select">40 - Easy</option>
          <option value="select">50 - Beginner</option>
        </FormControl>
      </FormGroup>
      <button>Submit</button>
    </form>);
  }
}

class Game extends React.Component {
  render() {
    return (<div className="game">
      <div className="game-board">
        <Board initial={33}/>
      </div>
      <div className="game-menu">
        <Menu/>
      </div>
    </div>);
  }
}

ReactDOM.render(<Game/>, document.getElementById('root'));
