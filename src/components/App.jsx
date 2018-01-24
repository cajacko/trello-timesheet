import React, { PureComponent } from 'react';
import Card from 'src/components/Card';
import { cards } from 'src/helpers/modules';

class App extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { cards: [] };
  }

  componentDidMount() {
    cards.getSuggestions().then(cards => {
      console.warn(cards);
      this.setState({ cards });
    });
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
            <div className="col small">Monday</div>
            <div className="col small">Tuesday</div>
            <div className="col small">Wednesday</div>
            <div className="col small">Thursday</div>
            <div className="col small">Friday</div>
            <div className="col small">Saturday</div>
            <div className="col small">Sunday</div>
            <div className="col small">Total this week</div>
            <div className="col small">Total all time</div>
          </header>

          {this.state.cards ? (
            <ul style={{ paddingLeft: 0 }} className="text-center">
              {this.state.cards.map(({ id, name, shortLink }, i) => {
                const noBorder = i === this.state.cards.length - 1;

                return (
                  <Card
                    key={id}
                    id={shortLink}
                    name={name}
                    noBorder={noBorder}
                  />
                );
              })}
            </ul>
          ) : (
            <div>Loading</div>
          )}

          <footer className="row border-top pt-3 text-center">
            <div className="col-3 text-left">Totals</div>
            <div className="col">0</div>
            <div className="col">0</div>
            <div className="col">2</div>
            <div className="col">3</div>
            <div className="col">0</div>
            <div className="col">0</div>
            <div className="col">0</div>
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
            <button className="btn btn-success">Save Changes</button>
          </div>
        </footer>
      </main>
    );
  }
}

export default App;
