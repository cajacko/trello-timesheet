import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import CardDay from 'src/components/CardDay';
import databaseDispatcher from 'src/helpers/databaseDispatcher';

class Card extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.listener = databaseDispatcher(
      `/cards/${this.props.cardId}`,
      'SET_CARD',
    );
  }

  componentWillUnMount() {
    if (this.listener && this.listener.off) this.listener.off();
  }

  render() {
    if (!this.props.card) return null;
    const { shortLink, name } = this.props.card;

    let classes = 'row pb-3 pt-3';

    if (!this.props.noBorder) classes += ' border-bottom';

    return (
      <li className={classes}>
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
      </li>
    );
  }
}

const mapStateToProps = ({ displayDates, cards }, { cardId }) => ({
  card: cards[cardId] || null,
  days: displayDates,
});

export default connect(mapStateToProps, undefined)(Card);
