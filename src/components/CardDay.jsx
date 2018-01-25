import React, { Component } from 'react';
import { cards } from 'src/helpers/modules';

class CardDay extends Component {
  constructor(props) {
    super(props);

    this.state = { time: null };

    this.onTimeChange = this.onTimeChange.bind(this);
  }

  componentDidMount() {
    cards.getCardDateTime(this.props.id, this.props.date).then(time => {
      this.setState({ time });
    });
  }

  onTimeChange(event) {
    this.props.onTimeChange(event.target.value);
  }

  render() {
    const value = this.props.changedTime || this.state.time;

    return (
      <div className="col d-flex justify-content-center">
        <input
          value={value || ''}
          className="form-control form-control-sm"
          style={{ maxWidth: 50 }}
          onChange={this.onTimeChange}
        />
      </div>
    );
  }
}

export default CardDay;
