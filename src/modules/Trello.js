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
                  args: {
                    cardId: t.getContext().card,
                  },
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

  static getCardId() {
    if (!Trello.isTrello()) return undefined;

    var t = window.TrelloPowerUp.iframe();

    return t.arg('cardId');
  }
}

export default Trello;
