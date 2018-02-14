import React, { PureComponent } from 'react';
import moment from 'moment';
import Timely from '../../modules/Timely';
import Trello from '../../modules/Trello';
import TimeInput from '../TimeInput';

class AddTime extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      view: 'times',
      durationViewValue: '00:10',
      error: null,
      date: moment(),
      endTime: moment().format('HH:mm'),
      loadingEntries: true,
      saving: false,
      duration: null,
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
      projects: null,
      project: null,
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.changeDay = this.changeDay.bind(this);
    this.getEntries = this.getEntries.bind(this);
    this.changeProject = this.changeProject.bind(this);
    this.changeDuration = this.changeDuration.bind(this);
    this.switchView = this.switchView.bind(this);
    this.changeDurationViewValue = this.changeDurationViewValue.bind(this);
  }

  componentDidMount() {
    Promise.all([
      this.getEntries(this.state.date),
      Timely.getProjects(),
      Trello.getCard(),
    ]).then(response => {
      const { labels } = response[2];
      const entries = response[0];
      const projects = response[1];

      const lastEntry = entries.find(({ endTime }) => !!endTime);

      const endTime = lastEntry ? lastEntry.endTime : null;

      const state = {
        projects: projects || null,
        project: (projects && projects[0] && projects[0].id) || null,
      };

      if (!labels.length) {
        state.error = 'This card has no labels!!!! :0';
      }

      if (endTime) {
        state.startTime = endTime;
        state.endTime = moment().format('HH:mm');
        state.duration = null;
      }

      this.setState(state);
    });
  }

  onChange(prop) {
    return value => {
      this.setState({ [prop]: value, duration: null });
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
      let startTime;
      let endTime;
      let duration;

      if (this.state.view === 'duration') {
        duration = this.getDurationMinutes(this.state.durationViewValue);
        startTime = this.state.date;

        if (!duration) {
          this.setState({ error: 'Could not get duration' });
          return;
        }

        duration = moment.duration(duration, 'minutes');
      } else {
        const times = this.getDates();
        startTime = times.startTime;
        endTime = times.endTime;

        if (!startTime || !endTime) {
          this.setState({ error: 'Could not convert times to dates' });
          return;
        }
      }

      this.setState({ saving: true });

      Timely.addEvent(startTime, endTime, duration, this.state.project)
        .then(() => {
          this.setState({ saving: false, error: null });
          Trello.closeModal();
        })
        .catch(error => {
          console.error(error);

          this.setState({
            saving: false,
            error:
              (error && error.message) ||
              'Could not save time, for unknown reason',
          });
        });
    }
  }

  changeProject(event) {
    this.setState({ project: event.target.value });
  }

  isStringNumberBetween(string, min, max) {
    const number = parseInt(string, 10);

    if (typeof number !== 'number' || isNaN(number)) return false;
    if (number < min || number > max) return false;

    return true;
  }

  getTimeError(prop, value) {
    const timeString = value ? value : this.state[prop];
    const parts = timeString.split(':');

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
    if (this.state.view === 'duration') {
      const duration = this.getDurationMinutes(this.state.durationViewValue);

      if (!duration) return 'Invalid duration';

      return null;
    }

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

  timeToDate(prop, value) {
    const date = new Date();
    const timeString = value ? value : this.state[prop];

    const parts = timeString.split(':');

    if (this.getTimeError(prop, value)) return null;

    date.setHours(parseInt(parts[0], 10));
    date.setMinutes(parseInt(parts[1], 10));

    return moment(date);
  }

  getDurationMinutes(duration) {
    if (!this.getTimeError(null, duration)) {
      const parts = duration.split(':');
      const hours = parseInt(parts[0], 10) * 60;
      const minutes = parseInt(parts[1], 10);

      return hours + minutes;
    }

    return null;
  }

  changeDuration(duration) {
    const state = { duration };

    const endTime = this.timeToDate('endTime');
    const minutes = this.getDurationMinutes(duration);

    if (minutes && endTime) {
      const startTime = endTime
        .clone()
        .subtract(minutes, 'minutes')
        .format('HH:mm');

      state.startTime = startTime;
    }

    this.setState(state);
  }

  getDuration() {
    if (this.state.duration) return this.state.duration;

    const startTime = this.timeToDate('startTime');
    const endTime = this.timeToDate('endTime');

    if (!startTime || !endTime) return '00:00';

    const diff = moment.duration(endTime.diff(startTime));

    return `${this.pad(diff.hours())}:${this.pad(diff.minutes())}`;
  }

  adjustBy(key, value) {
    return (minutes, add) => {
      if (key === 'duration' || key === 'durationViewValue') {
        const durationMinutes = this.getDurationMinutes(value);

        if (durationMinutes) {
          const finalMinutes = add
            ? durationMinutes + minutes
            : durationMinutes - minutes;

          const durationObj = moment.duration(finalMinutes, 'minutes');

          const timeString = `${this.pad(durationObj.hours())}:${this.pad(
            durationObj.minutes(),
          )}`;

          if (key === 'durationViewValue') {
            this.changeDurationViewValue(timeString);
          } else {
            this.changeDuration(timeString);
          }
        }
      } else {
        const date = this.timeToDate(key, value);

        if (date) {
          const timeString = date[add ? 'add' : 'subtract'](
            minutes,
            'minutes',
          ).format('HH:mm');

          this.onChange(key)(timeString);
        }
      }
    };
  }

  switchView(view) {
    return event => {
      event.preventDefault();
      this.setState({ view });
    };
  }

  changeDurationViewValue(durationViewValue) {
    this.setState({ durationViewValue });
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
                {!!this.state.projects &&
                  !!this.state.projects.length && (
                    <div className="form-group">
                      <label htmlFor="exampleFormControlSelect1">Project</label>
                      <select
                        className="form-control"
                        id="exampleFormControlSelect1"
                        onChange={this.changeProject}
                        value={this.state.project}
                      >
                        {this.state.projects.map(({ id, name }) => (
                          <option key={id} value={id}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                <div
                  className="btn-group mb-4 mt-2"
                  role="group"
                  aria-label="Basic example"
                >
                  <button
                    onClick={this.switchView('times')}
                    type="button"
                    className={`btn btn-${
                      this.state.view === 'times' ? 'info' : 'light'
                    }`}
                  >
                    Times
                  </button>
                  <button
                    onClick={this.switchView('duration')}
                    type="button"
                    className={`btn btn-${
                      this.state.view !== 'times' ? 'info' : 'light'
                    }`}
                  >
                    Duration
                  </button>
                </div>

                {this.state.view === 'times' ? (
                  <div>
                    <div className="form-row">
                      <div className="col">
                        <TimeInput
                          label="Start Time"
                          placeholder="09:00"
                          value={this.state.startTime}
                          onChange={this.onChange('startTime')}
                          adjustBy={this.adjustBy('startTime')}
                        />
                      </div>
                      <div className="col">
                        <TimeInput
                          label="End Time"
                          placeholder="14:00"
                          value={this.state.endTime}
                          onChange={this.onChange('endTime')}
                          adjustBy={this.adjustBy('endTime')}
                        />
                      </div>
                    </div>

                    <TimeInput
                      label="Duration"
                      value={duration}
                      onChange={this.changeDuration}
                      adjustBy={this.adjustBy('duration', duration)}
                    />
                  </div>
                ) : (
                  <TimeInput
                    label="Duration"
                    value={this.state.durationViewValue}
                    onChange={this.changeDurationViewValue}
                    adjustBy={this.adjustBy(
                      'durationViewValue',
                      this.state.durationViewValue,
                    )}
                  />
                )}
              </div>

              <button
                type="submit"
                id="submit"
                className="btn btn-primary"
                disabled={this.state.saving}
              >
                Add
              </button>

              {this.state.error &&
                !this.state.saving && (
                  <div className="alert alert-danger my-4" role="alert">
                    Error: {this.state.error}
                  </div>
                )}

              {this.state.saving && (
                <div className="alert alert-info my-4" role="alert">
                  Saving
                </div>
              )}
            </form>

            {!!this.state.entries &&
              !!this.state.entries.length &&
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
