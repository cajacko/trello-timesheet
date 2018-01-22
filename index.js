console.log(4);

var GRAY_ICON =
  'https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-gray.svg';

TrelloPowerUp.initialize({
  'card-buttons': function(t, options) {
    return [
      {
        icon:
          'https://cdn.glitch.com/1b42d7fe-bda8-4af8-a6c8-eff0cea9e08a%2Frocket-ship.png?1494946700421',
        text: 'Timesheet',
        callback: function(t) {
          return t.modal({
            title: 'Timesheet',
            url: 'https://cajacko.github.io/trello-timesheet/form.html',
            height: 800,
          });
        },
      },
    ];
  },
});
