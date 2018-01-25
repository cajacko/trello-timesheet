import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import CardDay from 'src/components/CardDay';

class Card extends PureComponent {
  constructor(props) {
    super(props);
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
          />
        ))}
        <div className="col">5</div>
        <div className="col">24</div>
      </li>
    );
  }
}

const mapStateToProps = ({ displayDates, cards }, { cardId }) => ({
  card: cards[cardId] || null,
  days: displayDates,
});

export default connect(mapStateToProps, undefined)(Card);
