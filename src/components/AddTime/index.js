import React, { PureComponent } from 'react';
import moment from 'moment';

class AddTime extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      error: 'Yes',
      duration: '2:00',
      date: moment(),
      endTime: moment().format('h:mm'),
      startTime: moment()
        .subtract(1, 'hours')
        .format('h:mm'),
      entries: [
        {
          title: 'Hello',
          startTime: '12:00',
          endTime: '20:00',
        },
      ],
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.changeDay = this.changeDay.bind(this);
  }

  onChange(prop) {
    return event => {
      event.preventDefault();
      console.warn('onChange', event.target.value);
    };
  }

  onSubmit(event) {
    event.preventDefault();
    console.warn('onChange', this.state);
  }

  changeDay(increment) {
    return event => {
      event.preventDefault();
      console.warn('changeDay', increment);
    };
  }

  render() {
    const buttonStyle = { minWidth: 50 };

    return (
      <div>
        <header className="d-flex justify-content-between">
          <button
            className="btn btn-light"
            style={buttonStyle}
            onClick={this.changeDay(false)}
          >
            <i className="fa fa-angle-left" aria-hidden="true" />
          </button>
          <h3>{this.state.date.format('dddd Do MMMM, YYYY')}</h3>
          <button
            className="btn btn-light"
            style={buttonStyle}
            onClick={this.changeDay(true)}
          >
            <i className="fa fa-angle-right" aria-hidden="true" />
          </button>
        </header>

        {this.state.entries && (
          <table className="table table-striped my-4">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Start Time</th>
                <th scope="col">End Time</th>
              </tr>
            </thead>
            <tbody>
              {this.state.entries.map(({ title, startTime, endTime }) => (
                <tr key={startTime}>
                  <td>{title}</td>
                  <td>{startTime}</td>
                  <td>{endTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <form id="timesheet" onSubmit={this.onSubmit}>
          <div className="my-4">
            <div className="form-group">
              <label htmlFor="timesheetDate">Start Time:</label>
              <input
                id="timesheetDate"
                type="text"
                name="date"
                placeholder="09:00"
                value={this.state.startTime}
                className="form-control"
                onChange={this.onChange('startTime')}
              />
            </div>

            <div className="form-group">
              <label htmlFor="timesheetDate">End Time:</label>
              <input
                id="timesheetDate"
                type="text"
                name="date"
                placeholder="14:00"
                value={this.state.endTime}
                className="form-control"
                onChange={this.onChange('endTime')}
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
