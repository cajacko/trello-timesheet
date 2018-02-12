class Trello {
  static init() {
    global.TrelloPowerUp.initialize({
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

export default Trello;
