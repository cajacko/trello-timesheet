import React, { Component } from 'react';
import { connect } from 'react-redux';
import { cards } from 'src/helpers/modules';
import getTimeIdFromCardIdDateString from 'src/helpers/getTimeIdFromCardIdDateString';
import databaseDispatcher from 'src/helpers/databaseDispatcher';

class CardDay extends Component {
  constructor(props) {
    super(props);

    this.onTimeChange = this.onTimeChange.bind(this);
  }

  componentDidMount() {
    const { cardId, dateString } = this.props;

    const timeId = getTimeIdFromCardIdDateString(cardId, dateString);

    databaseDispatcher(`times/${timeId}`, 'SET_TIME', {
      cardId,
      dateString,
      timeId,
    });
  }

  onTimeChange(event) {
    this.props.onTimeChange(event.target.value);
  }

  render() {
    const value =
      this.props.changedTime === undefined
        ? this.props.savedTime
        : this.props.changedTime;

    return (
      <div className="col d-flex justify-content-center">
        <input
          value={value || ''}
          className="form-control form-control-sm"
          style={{ maxWidth: 50 }}
          onChange={this.onTimeChange}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ times }, { cardId, dateString }) => {
  const timeId = getTimeIdFromCardIdDateString(cardId, dateString);

  return {
    savedTime: times.times[timeId],
    changedTime: times.changes.times[timeId],
  };
};

const mapDispatchToProps = (dispatch, { cardId, dateString }) => ({
  onTimeChange: value =>
    dispatch({
      type: 'SET_CHANGED_TIME',
      payload: {
        cardId,
        dateString,
        value,
      },
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(CardDay);
