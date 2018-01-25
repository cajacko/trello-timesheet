import React, { PureComponent } from 'react';
import cloneDeep from 'lodash/fp/cloneDeep';
import isEqual from 'lodash/fp/isEqual';
import { setTimes } from 'src/helpers/times';
import getTimeIdFromCardIdDateString from 'src/helpers/getTimeIdFromCardIdDateString';
import getDateStringFromDate from 'src/helpers/getDateStringFromDate';
import { connect } from 'react-redux';
import Card from 'src/components/Card';
import getTotal from 'src/helpers/getTotal';
import AddCard from 'src/components/AddCard';

class App extends PureComponent {
  constructor(props) {
    super(props);

    this.defaultTotals = {
      days: {},
      cards: {},
      week: null,
    };

    this.totals = {
      times: {},
      datesByCard: {},
      cardsByDate: {},
    };

    this.lastSetTotals = null;

    this.state = { totals: this.defaultTotals };

    this.updateTotals = this.updateTotals.bind(this);
    this.removeFromTotals = this.removeFromTotals.bind(this);
  }

  componentDidMount() {
    this.props.updateTrello();
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.initStatus === 'REQUESTED' &&
      nextProps.initStatus === 'SUCCEEDED'
    ) {
      this.props.getSuggestions(nextProps.days[0].date);

      setInterval(() => {
        if (this.props.trelloStatus === 'SUCCEEDED') {
          this.props.updateTrello();
        }
      }, 10000);
    }
  }

  updateTotals(cardId, dateString, value) {
    const timeId = getTimeIdFromCardIdDateString(cardId, dateString);
    this.totals = setTimes(this.totals, timeId, cardId, dateString, value);

    this.setTotals();
  }

  removeFromTotals(cardId, dateString) {
    const timeId = getTimeIdFromCardIdDateString(cardId, dateString);
    this.totals = removeTimes(this.totals, timeId, cardId, dateString);

    this.setTotals();
  }

  setTotals() {
    // TODO: Only run once every x ms

    const { cardsByDate, times } = this.totals;

    const totals = cloneDeep(this.defaultTotals);

    Object.keys(cardsByDate).forEach(dateString => {
      const cards = cardsByDate[dateString];

      Object.keys(cards).forEach(cardId => {
        const timeId = getTimeIdFromCardIdDateString(cardId, dateString);
        const time = times[timeId];
        const value = time || 0;

        if (!totals.days[dateString]) totals.days[dateString] = 0;
        if (!totals.cards[cardId]) totals.cards[cardId] = 0;
        if (!totals.week) totals.week = 0;

        totals.days[dateString] += value;
        totals.cards[cardId] += value;
        totals.week += value;
      });
    });

    if (isEqual(this.state.totals, totals)) return;

    this.setState({ totals });
  }

  render() {
    if (
      this.props.initStatus === 'REQUESTED' ||
      !this.props.suggestionsStauts ||
      this.props.suggestionsStauts === 'REQUESTED'
    ) {
      return <p>Loading</p>;
    }

    if (
      this.props.initStatus === 'FAILED' ||
      this.props.suggestionsStauts === 'FAILED'
    )
      return <p>Error, check console and reload</p>;

    return (
      <main
        className="flex-column pt-4 pb-4 d-flex"
        style={{ width: '100vw', height: '100vh' }}
      >
        <header className="container-fluid border-bottom pb-3">
          <div className="mb-4 d-flex justify-content-end">
            <button className="btn btn-info btn-sm">Previous week</button>
            <button className="btn btn-info ml-4 btn-sm">Next week</button>
          </div>

          <div className="row  text-center">
            <div className="col-3 text-left small">Card</div>
            {this.props.days.map(({ day, dateString }) => (
              <div key={dateString} className="col d-flex flex-column">
                <span className="small">{day}</span>{' '}
                <span style={{ fontSize: '0.7rem' }}>{dateString}</span>
              </div>
            ))}
            <div className="col small">Total this week</div>
          </div>
        </header>

        <div style={{ overflow: 'auto', flex: 1 }}>
          {this.props.cards ? (
            <ul style={{ paddingLeft: 0 }} className="text-center">
              {this.props.cards.map((cardId, i) => {
                const noBorder = i === this.props.cards.length - 1;

                return (
                  <Card
                    key={cardId}
                    cardId={cardId}
                    noBorder={noBorder}
                    updateTotals={this.updateTotals}
                    removeFromTotals={this.removeFromTotals}
                    total={getTotal(this.state.totals, 'cards', cardId)}
                  />
                );
              })}
            </ul>
          ) : (
            <div>Loading</div>
          )}
        </div>

        <footer className="container-fluid border-top pt-3">
          <div className="row text-center">
            <div className="col-3 text-left">Totals</div>
            {this.props.days.map(({ dateString }) => (
              <div key={dateString} className="col">
                {getTotal(this.state.totals, 'days', dateString)}
              </div>
            ))}
            <div className="col">{getTotal(this.state.totals, 'week')}</div>
          </div>

          <div className="d-flex justify-content-between pt-3">
            <AddCard />
            <button
              className="btn btn-success"
              onClick={this.props.saveChanges}
            >
              Save Changes
            </button>
          </div>
        </footer>
      </main>
    );
  }
}

const mapStateToProps = ({
  displayDates,
  cardsPerWeek,
  status,
  addedCards,
}) => {
  const cards = cardsPerWeek[displayDates[0].dateString] || [];

  addedCards.forEach(id => {
    if (!cards.includes(id)) {
      cards.push(id);
    }
  });

  return {
    cards,
    days: displayDates,
    initStatus: status.init,
    suggestionsStauts: status.suggestions[displayDates[0].dateString],
    trelloStatus: status.trello,
  };
};

const mapDispatchToProps = dispatch => ({
  getSuggestions: date =>
    dispatch({ type: 'GET_SUGGESTIONS_REQUESTED', payload: date }),
  saveChanges: () => dispatch({ type: 'SAVE_CHANGES_REQUESTED' }),
  updateTrello: () => dispatch({ type: 'UPDATE_TRELLO_REQUESTED' }),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
