import React, { Component } from 'react';
import { connect } from 'react-redux';
import Card from 'src/components/Card';

class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getSuggestions(this.props.days[0].date);
  }

  render() {
    return (
      <main className="container-fluid pt-4 pb-4">
        <header className="container-fluid mb-4 d-flex justify-content-end">
          <button className="btn btn-info btn-sm">Previous week</button>
          <button className="btn btn-info ml-4 btn-sm">Next week</button>
        </header>

        <section className="container-fluid">
          <header className="row border-bottom pb-3 text-center">
            <div className="col-3 text-left small">Card</div>
            {this.props.days.map(({ day, dateString }) => (
              <div key={dateString} className="col small">
                {day} - {dateString}
              </div>
            ))}
            <div className="col small">Total this week</div>
            <div className="col small">Total all time</div>
          </header>

          {this.props.cards ? (
            <ul style={{ paddingLeft: 0 }} className="text-center">
              {this.props.cards.map((cardId, i) => {
                const noBorder = i === this.props.cards.length - 1;

                return (
                  <Card key={cardId} cardId={cardId} noBorder={noBorder} />
                );
              })}
            </ul>
          ) : (
            <div>Loading</div>
          )}

          <footer className="row border-top pt-3 text-center">
            <div className="col-3 text-left">Totals</div>
            {this.props.days.map(({ dateString }) => (
              <div key={dateString} className="col">
                0
              </div>
            ))}
            <div className="col">5</div>
            <div className="col">24</div>
          </footer>
        </section>

        <footer className="container-fluid row mt-5">
          <div className="col">
            <div className="form-group">
              <label>Add a card, search by card name or id</label>

              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Card name or id"
                />
                <div className="input-group-append">
                  <button className="btn btn-outline-secondary" type="button">
                    Add entry
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="col d-flex justify-content-end align-items-end pb-1">
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

const mapStateToProps = ({ displayDates, cardsPerWeek }) => ({
  cards: cardsPerWeek[displayDates[0].dateString] || [],
  days: displayDates,
});

const mapDispatchToProps = dispatch => ({
  getSuggestions: date =>
    dispatch({ type: 'GET_SUGGESTIONS_REQUESTED', payload: date }),
  saveChanges: () => dispatch({ type: 'SAVE_CHANGES_REQUESTED' }),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
