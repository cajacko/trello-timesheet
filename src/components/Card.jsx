import React, { Component } from 'react';
import CardDay from 'src/components/CardDay';

class Card extends Component {
  constructor(props) {
    super(props);

    this.onTimeChange = this.onTimeChange.bind(this);
  }

  onTimeChange(date) {
    return value => this.props.onTimeChange(this.props.id, date, value);
  }

  render() {
    let classes = 'row pb-3 pt-3';

    if (!this.props.noBorder) classes += ' border-bottom';

    const days = [
      '2018-01-01',
      '2018-01-02',
      '2018-01-03',
      '2018-01-04',
      '2018-01-05',
      '2018-01-06',
      '2018-01-07',
    ];

    return (
      <li className={classes}>
        <div className="col-3 text-left small">
          #{this.props.shortLink} - {this.props.name}
        </div>
        {days.map(day => {
          const changedTime = this.props.changes[day] || null;

          return (
            <CardDay
              id={this.props.id}
              date={day}
              key={`${this.props.id}-${day}`}
              changedTime={changedTime}
              onTimeChange={this.onTimeChange(day)}
            />
          );
        })}
        <div className="col">5</div>
        <div className="col">24</div>
      </li>
    );
  }
}

export default Card;
