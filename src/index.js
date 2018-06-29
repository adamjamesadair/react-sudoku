import React from 'react';
import ReactDOM from 'react-dom';
import * as sg from './sudokuGenerator.js';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import {FormGroup, ControlLabel, FormControl, Button} from 'react-bootstrap';
var _ = require('lodash');

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
  }

  handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.target.blur();
    }
  }

  handleSubmit(e, i) {
    const squares = this.state.squares.slice();
    squares[i].value = e.target.value;
    this.setState({squares: squares});
  }

  handleValidation(squares) {
    const cells = sg.elementsToPositions(squares.slice());

    let neighbours;
    cells.forEach((cell) => {
      if (cell.value) {
        cell.classes.delete(" conflict");
        neighbours = sg.getNeighbours(cell.coords, cells);
        neighbours.forEach((neighbour, i) => {
          if (neighbour) {
            if (String(neighbour.value) === String(cell.value)) {
              cell.classes.add(" conflict");
            }
          }
        });
      }
    });
    let newSquares = sg.elementsToPositions(cells);
    this.setState({squares: newSquares});

    // Check for win
    let hasConflict = cells.map(cell => cell.classes).map(set => set.has(" conflict")).includes(true);
    let hasEmpty = cells.map(cell => cell.value).includes('');
    if (!hasEmpty && !hasConflict) {
      console.log('Puzzle Solved!!');
    }
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
    board.push(<Button className="validation" onClick={() => {
        this.handleValidation(this.state.squares)
      }} key={"v-" + _.random(0, 1000)}>Validate</Button>);
    return (board);
  }

  renderSquare(i) {
    let disabled = false;
    if (this.state.squares[i].initial) {
      disabled = true;
    }

    let className = "";
    this.state.squares[i].classes.forEach((element) => className += element);

    return (<Square value={this.state.squares[i].value} disabled={disabled} className={className} key={i} onKeyDown={this.handleKeyPress} onChange={(e) => this.handleSubmit(e, i)}/>);
  }

  render() {
    return (this.createBoard());
  }
}

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.initialFilled = 33;
  }

  render() {
    return (<div>
      <h5>Generate New</h5>
      <form>
        <FormGroup controlId="formControlsSelect">
          <ControlLabel>Initial cells</ControlLabel>
          <FormControl className="difficulty-select" defaultValue={this.initialFilled} inputRef={input => this.initialFilled = input} componentClass="select" placeholder="select">
            <option value="17">17 - Extreme</option>
            <option value="26">26 - Hard</option>
            <option value="33">33 - Medium</option>
            <option value="40">40 - Easy</option>
            <option value="50">50 - Beginner</option>
            <option value="80">80 - Testing</option>
            <option value="81">81 - Solved</option>
          </FormControl>
        </FormGroup>
      </form>
      <Button className="generate-btn" onClick={() => {
          this.props.onGenerate(this.initialFilled.value);
        }}>Generate</Button>
    </div>);

  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initial: 33
    };
  }

  handleGeneration = (initial) => {
    this.setState({initial: initial});
  };

  render() {
    return (<div className="game">
      <div className="game-board">
        <Board key={_.random(0, 1000)} initial={this.state.initial}/>
        <div className="game-menu">
          <Menu onGenerate={this.handleGeneration}/>
        </div>
      </div>
    </div>);
  }
}

ReactDOM.render(<Game/>, document.getElementById('root'));
