import React, { PureComponent } from 'react';
import moment from 'moment';

class AddTime extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      error: 'Yes',
      duration: '2:00',
      date: moment(),
      endTime: moment(),
      startTime: moment().subtract(1, 'hours'),
    };
  }

  render() {
    const startTime = this.state.startTime.format('h:mm');
    const endTime = this.state.endTime.format('h:mm');

    const buttonStyle = { minWidth: 50 };

    return (
      <div>
        <header className="d-flex justify-content-between">
          <button className="btn btn-light" style={buttonStyle}>
            <i className="fa fa-angle-left" aria-hidden="true" />
          </button>
          <h3>{this.state.date.format('dddd Do MMMM, YYYY')}</h3>
          <button className="btn btn-light" style={buttonStyle}>
            <i className="fa fa-angle-right" aria-hidden="true" />
          </button>
        </header>

        <form id="timesheet">
          <div className="my-4">
            <div className="form-group">
              <label htmlFor="timesheetDate">Start Time:</label>
              <input
                id="timesheetDate"
                type="text"
                name="date"
                placeholder="09:00"
                value={startTime}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="timesheetDate">End Time:</label>
              <input
                id="timesheetDate"
                type="text"
                name="date"
                placeholder="14:00"
                value={endTime}
                className="form-control"
              />
            </div>
          </div>

          <div className="alert alert-secondary" role="alert">
            Duration: {this.state.duration}hrs
          </div>

          {this.state.error && (
            <div className="alert alert-danger" role="alert">
              Error: {this.state.error}
            </div>
          )}

          <button
            type="submit"
            id="submit"
            className="btn btn-primary"
            disabled={this.state.error}
          >
            Add
          </button>
        </form>
      </div>
    );
  }
}

export default AddTime;
