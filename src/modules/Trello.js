class Trello {
  static isTrello() {
    return (
      window.location.ancestorOrigins &&
      window.location.ancestorOrigins.contains('https://trello.com')
    );
  }

  static init() {
    if (Trello.isTrello()) {
      window.TrelloPowerUp.initialize({
        'card-buttons': function(t, options) {
          return [
            {
              icon:
                'https://cdn.glitch.com/1b42d7fe-bda8-4af8-a6c8-eff0cea9e08a%2Frocket-ship.png?1494946700421',
              text: 'Add Time',
              callback: function(t) {
                return t.modal({
                  title: 'Add Time',
                  url: './add-time',
                  height: 800,
                });
              },
            },
          ];
        },
      });
    }
  }

  static setData(key, value) {
    localStorage.setItem(key, value);
    return Promise.resolve();
  }

  static getData(key) {
    return Promise.resolve(localStorage.getItem(key));
  }

  static getCard() {
    if (!Trello.isTrello()) {
      return Promise.resolve({
        id: 'localId',
        name: 'Local Trello Card Name',
        labels: [
          {
            name: 'label name',
          },
          {
            name: 'another label',
          },
        ],
      });
    }

    var t = window.TrelloPowerUp.iframe();

    return t.card('all');
  }

  static closeModal() {
    if (!Trello.isTrello()) return;

    var t = window.TrelloPowerUp.iframe();

    t.closeModal();
  }
}

export default Trello;
