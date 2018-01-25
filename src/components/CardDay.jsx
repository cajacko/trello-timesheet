import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { cards } from 'src/helpers/modules';
import getTimeIdFromCardIdDateString from 'src/helpers/getTimeIdFromCardIdDateString';
import databaseDispatcher from 'src/helpers/databaseDispatcher';

class CardDay extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { value: this.getValue(props) };

    this.onTimeChange = this.onTimeChange.bind(this);
  }

  componentDidMount() {
    const { cardId, dateString, updateTotals } = this.props;

    updateTotals(cardId, dateString, this.state.value);

    const timeId = getTimeIdFromCardIdDateString(cardId, dateString);

    this.listener = databaseDispatcher(`times/${timeId}`, 'SET_TIME', {
      cardId,
      dateString,
      timeId,
    });
  }

  componentWillUnMount() {
    if (this.listener && this.listener.off) this.listener.off();
  }

  componentWillReceiveProps(nextProps) {
    const value = this.getValue(nextProps);

    if (value !== this.state.value) {
      this.setState({ value });
      this.props.updateTotals(this.props.cardId, this.props.dateString, value);
    }
  }

  componentWillUnMount() {
    this.props.removeFromTotals(this.props.cardId, this.props.dateString);
  }

  getValue({ changedTime, savedTime }) {
    return changedTime === undefined ? savedTime : changedTime;
  }

  onTimeChange(event) {
    this.props.onTimeChange(event.target.value);
  }

  render() {
    return (
      <div className="col d-flex justify-content-center">
        <input
          value={this.state.value || ''}
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
