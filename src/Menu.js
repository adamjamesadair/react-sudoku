import React from 'react';
import {FormGroup, ControlLabel, FormControl, Button} from 'react-bootstrap';

export default class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.initialFilled = 33;
  }

  renderOptions(start, end) {
    let result = [];
    for (let i = start; i < end; i++) {
      result.push(<option key={'option-' + i} value={String(i)}>{i}</option>);
    }
    return result;
  }

  render() {
    return (<div>
      <h5>Generate New</h5>
      <form>
        <FormGroup controlId="formControlsSelect">
          <ControlLabel>Initial cells</ControlLabel>
          <FormControl className="difficulty-select" defaultValue={this.initialFilled} inputRef={input => this.initialFilled = input} componentClass="select" placeholder="select">
            <option value="17">17 - Extreme</option>
            {this.renderOptions(18, 26)}
            <option value="26">26 - Hard</option>
            {this.renderOptions(27, 33)}
            <option value="33">33 - Medium</option>
            {this.renderOptions(34, 40)}
            <option value="40">40 - Easy</option>
            {this.renderOptions(41, 50)}
            <option value="50">50 - Beginner</option>
            {this.renderOptions(50, 65)}
            <option value="65">65 - Baby</option>
            {this.renderOptions(66, 81)}
            <option value="81">81 - Solved</option>
          </FormControl>
        </FormGroup>
      </form>
      <Button className="generate-btn" onClick={() => {
          this.props.onGenerate(this.initialFilled.value);
        }}>Generate</Button>
      <p className="instructions">Select the number of initial cells, then click generate!</p>
    </div>);
  }
}
