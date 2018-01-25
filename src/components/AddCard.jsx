import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { cards } from 'src/helpers/modules';

class AddCard extends PureComponent {
  constructor(props) {
    super(props);

    this.cards = [];
    this.state = { cards: [], searchText: '' };

    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  onChange(event) {
    const searchText = event.target.value;

    if (searchText === this.state.searchText) return;

    this.setState({ searchText });
    this.cards = [];

    cards.search(searchText, results => {
      if (this.state.searchText === searchText) {
        const newCards = results.map(({ id, name }) => ({ id, name }));

        const allCards = this.cards.concat(newCards);

        this.cards = allCards;
        this.setState({ cards: allCards });
        return true;
      }

      return false;
    });
  }

  onClick(event, id) {
    event.preventDefault();

    this.props.addCard(id);
  }

  render() {
    return (
      <div>
        <button
          type="button"
          className="btn btn-info"
          data-toggle="modal"
          data-target="#exampleModalLong"
        >
          Add Card
        </button>

        <div
          className="modal fade"
          id="exampleModalLong"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLongTitle"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">
                  Modal title
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">
                    Search by card name
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    placeholder="Card name"
                    value={this.state.searchText}
                    onChange={this.onChange}
                  />
                </div>

                <div className="list-group">
                  {this.state.cards.map(({ id, name }) => (
                    <button
                      key={id}
                      type="button"
                      data-dismiss="modal"
                      className={`list-group-item list-group-item-action ${
                        this.state.selected === id ? 'active' : ''
                      }`}
                      onClick={event => this.onClick(event, id)}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = dispatch => ({
  addCard: id => dispatch({ type: 'ADD_CARD_REQUESTED', payload: id }),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddCard);
