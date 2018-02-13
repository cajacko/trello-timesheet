import React, { PureComponent } from 'react';
import moment from 'moment';
import Timely from '../../modules/Timely';

class AddTime extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      duration: '2:00',
      date: moment(),
      endTime: moment().format('h:mm'),
      loadingEntries: true,
      saving: false,
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

  componentDidMount() {
    this.getEntries(this.state.date);
  }

  onChange(prop) {
    return event => {
      event.preventDefault();
      this.setState({ [prop]: event.target.value });
    };
  }

  onSubmit(event) {
    event.preventDefault();
    const error = this.getError();

    if (error) {
      this.setState({ error });
    } else {
      this.setState({ saving: true });
    }
  }

  isStringNumberBetween(string, min, max) {
    const number = parseInt(string, 10);

    console.warn(string, min, max);

    if (typeof number !== 'number' || isNaN(number)) return false;
    if (number < min || number > max) return false;

    return true;
  }

  getTimeError(prop) {
    const parts = this.state[prop].split(':');

    if (parts.length !== 2) {
      return `${prop} must be in the form "12:00"`;
    }

    if (!this.isStringNumberBetween(parts[0], 0, 23)) {
      return `${prop} hours must be a number between 0-23`;
    }

    if (!this.isStringNumberBetween(parts[1], 0, 59)) {
      return `${prop} minutes must be a number between 0-59`;
    }

    return null;
  }

  getError() {
    const startError = this.getTimeError('startTime');

    if (startError) return startError;

    const endError = this.getTimeError('endTime');

    if (endError) return startError;

    return null;
  }

  getEntries(date) {
    if (!this.state.loadingEntries) this.setState({ loadingEntries: true });

    Timely.getEntries(date)
      .then(entries => {
        if (
          date.format('YYYY MM DD') !== this.state.date.format('YYYY MM DD')
        ) {
          return;
        }

        this.setState({ entries, loadingEntries: false });
      })
      .catch(error => {
        this.setState({
          entries: null,
          loadingEntries: false,
          error: (error && error.message) || 'Could not load entries',
        });
      });
  }

  changeDay(increment) {
    return event => {
      event.preventDefault();

      const date = this.state.date.clone();

      if (increment) {
        date.add(1, 'days');
      } else {
        date.subtract(1, 'days');
      }

      this.setState({ date, loadingEntries: true });

      this.getEntires(date);
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

        {this.state.loadingEntries && (
          <div className="alert alert-info my-4" role="alert">
            Loading
          </div>
        )}

        {this.state.entries &&
          !this.state.loadingEntries && (
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

          {this.state.error &&
            !this.state.saving && (
              <div className="alert alert-danger" role="alert">
                Error: {this.state.error}
              </div>
            )}

          {this.state.saving && (
            <div className="alert alert-info my-4" role="alert">
              Saving
            </div>
          )}

          <button
            type="submit"
            id="submit"
            className="btn btn-primary"
            disabled={this.state.saving}
          >
            Add
          </button>
        </form>
      </div>
    );
  }
}

export default AddTime;
