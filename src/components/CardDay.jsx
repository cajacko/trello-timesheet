import React, { PureComponent } from 'react';

class CardDay extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="col d-flex justify-content-center">
        <input
          className="form-control form-control-sm"
          style={{ maxWidth: 50 }}
        />
      </div>
    );
  }
}

export default CardDay;
