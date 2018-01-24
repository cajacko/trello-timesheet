import React, { PureComponent } from 'react';
import CardDay from 'src/components/CardDay';

class Card extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    let classes = 'row pb-3 pt-3';

    if (!this.props.noBorder) classes += ' border-bottom';

    return (
      <li className={classes}>
        <div className="col-3 text-left small">
          #{this.props.id} - {this.props.name}
        </div>
        <CardDay />
        <CardDay />
        <CardDay />
        <CardDay />
        <CardDay />
        <CardDay />
        <CardDay />
        <div className="col">5</div>
        <div className="col">24</div>
      </li>
    );
  }
}

export default Card;
