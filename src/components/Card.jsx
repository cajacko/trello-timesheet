import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import CardDay from 'src/components/CardDay';
import databaseDispatcher from 'src/helpers/databaseDispatcher';

class Card extends PureComponent {
  constructor(props) {
    super(props);

    this.scroll = this.scroll.bind(this);
    this.setRef = this.setRef.bind(this);
  }

  componentDidMount() {
    this.listener = databaseDispatcher(
      `/cards/${this.props.cardId}`,
      'SET_CARD',
    );

    if (this.props.isAddedCard) this.scroll();
  }

  scroll() {
    this.ref.scrollIntoView();
  }

  componentWillUnMount() {
    if (this.listener && this.listener.off) this.listener.off();
  }

  setRef(ref) {
    this.ref = ref;
  }

  render() {
    if (!this.props.card) return null;
    const { shortLink, name } = this.props.card;

    let classes = 'container-fluid pb-3 pt-3';

    if (!this.props.noBorder) classes += ' border-bottom';

    return (
      <li className={classes} ref={this.setRef}>
        <div className="row">
          <div className="col-3 text-left small">
            #{shortLink} - {name}
          </div>
          {this.props.days.map(({ dateString }) => (
            <CardDay
              key={dateString}
              cardId={this.props.cardId}
              dateString={dateString}
              updateTotals={this.props.updateTotals}
              removeFromTotals={this.props.removeFromTotals}
            />
          ))}
          <div className="col">{this.props.total}</div>
        </div>
      </li>
    );
  }
}

const mapStateToProps = ({ displayDates, cards, addedCards }, { cardId }) => ({
  card: cards[cardId] || null,
  days: displayDates,
  isAddedCard: addedCards.includes(cardId),
});

export default connect(mapStateToProps, undefined)(Card);
