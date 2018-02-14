import React, { PureComponent } from 'react';

class TimeInput extends PureComponent {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleKeyPress(event) {
    const shift = event.shiftKey;
    const alt = event.altKey;

    const up = event.key === 'ArrowUp';
    const down = event.key === 'ArrowDown';

    if (up || down) {
      let size;

      if (shift) {
        size = 60;
      } else if (alt) {
        size = 10;
      } else {
        size = 1;
      }

      if (this.props.adjustBy) this.props.adjustBy(size, up);
    }
  }

  onChange(event) {
    event.preventDefault();
    this.props.onChange(event.target.value);
  }

  render() {
    return (
      <div className="form-group">
        <label htmlFor="timesheetDate">{this.props.label}:</label>
        <input
          id="timesheetDate"
          type="text"
          name="date"
          placeholder={this.props.placeholder}
          value={this.props.value}
          className="form-control"
          onChange={this.onChange}
          onKeyDown={this.handleKeyPress}
        />
      </div>
    );
  }
}

export default TimeInput;
