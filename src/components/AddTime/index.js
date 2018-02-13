import React, { PureComponent } from 'react';
import moment from 'moment';
import Timely from '../../modules/Timely';

class AddTime extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      date: moment(),
      endTime: moment().format('HH:mm'),
      loadingEntries: true,
      saving: false,
      startTime: moment()
        .subtract(1, 'hours')
        .format('HH:mm'),
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
    this.getEntries = this.getEntries.bind(this);
  }

  componentDidMount() {
    this.getEntries(this.state.date).then(entries => {
      const { endTime } = entries.find(({ endTime }) => !!endTime);

      if (endTime) {
        this.setState({
          startTime: endTime,
          endTime: moment().format('HH:mm'),
        });
      }
    });
  }

  onChange(prop) {
    return event => {
      event.preventDefault();
      this.setState({ [prop]: event.target.value });
    };
  }

  getDates() {
    try {
      const date = this.state.date.clone();
      date.seconds(0);
      date.milliseconds(0);

      const startTime = date.clone();
      const endTime = date.clone();

      const startTimes = this.state.startTime.split(':');
      const endTimes = this.state.endTime.split(':');

      startTime.hours(parseInt(startTimes[0], 10));
      startTime.minutes(parseInt(startTimes[1], 10));
      endTime.hours(parseInt(endTimes[0], 10));
      endTime.minutes(parseInt(endTimes[1], 10));

      return { startTime, endTime };
    } catch (e) {
      return {};
    }
  }

  onSubmit(event) {
    event.preventDefault();
    const error = this.getError();

    if (error) {
      this.setState({ error });
    } else {
      const { startTime, endTime } = this.getDates();

      if (!startTime || !endTime) {
        this.setState({ error: 'Could not convert times to dates' });
        return;
      }

      this.setState({ saving: true });

      Timely.addEvent('Card name from Trello', startTime, endTime)
        .then(() => {
          this.setState({ saving: false, error: null });
        })
        .catch(error => {
          this.setState({
            saving: false,
            error:
              (error && error.message) ||
              'Could not save time, for unknown reason',
          });
        });
    }
  }

  isStringNumberBetween(string, min, max) {
    const number = parseInt(string, 10);

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

    return Timely.getEntries(date)
      .then(entries => {
        if (
          date.format('YYYY MM DD') !== this.state.date.format('YYYY MM DD')
        ) {
          return;
        }

        this.setState({ entries, loadingEntries: false });

        return entries;
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

      this.getEntries(date);
    };
  }

  pad(n) {
    return n < 10 ? '0' + n : n;
  }

  timeToDate(prop) {
    const date = new Date();

    const parts = this.state[prop].split(':');

    if (this.getTimeError(prop)) return null;

    date.setHours(parseInt(parts[0], 10));
    date.setMinutes(parseInt(parts[1], 10));

    return moment(date);
  }

  getDuration() {
    const startTime = this.timeToDate('startTime');
    const endTime = this.timeToDate('endTime');

    if (!startTime || !endTime) return '00:00';

    const diff = moment.duration(endTime.diff(startTime));

    return `${this.pad(diff.hours())}:${this.pad(diff.minutes())}`;
  }

  render() {
    const buttonStyle = { minWidth: 50 };

    const duration = this.getDuration();

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

        {this.state.loadingEntries ? (
          <div className="alert alert-info my-4" role="alert">
            Loading
          </div>
        ) : (
          <div>
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
                Duration: {duration}hrs
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
          </div>
        )}
      </div>
    );
  }
}

export default AddTime;
