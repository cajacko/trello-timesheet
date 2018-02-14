import React, { PureComponent } from 'react';

class TimeInput extends PureComponent {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
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
        />
      </div>
    );
  }
}

export default TimeInput;
