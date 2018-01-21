var GRAY_ICON =
  'https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-gray.svg';

TrelloPowerUp.initialize({
  'attachment-sections': function(t, options) {
    console.warn('Attachment section');

    return [
      {
        id: 'Timesheet', // optional if you aren't using a function for the title
        // claimed: claimed,
        icon: GRAY_ICON, // Must be a gray icon, colored icons not allowed.
        title: 'Timesheet',
        content: {
          type: 'iframe',
          url: t.signUrl(
            'https://cajacko.github.io/trello-timesheet/section.html',
            {
              arg: 'you can pass your section args here',
            },
          ),
          height: 230,
        },
      },
    ];
  },

  'card-buttons': function(t, options) {
    return [
      {
        icon:
          'https://cdn.glitch.com/1b42d7fe-bda8-4af8-a6c8-eff0cea9e08a%2Frocket-ship.png?1494946700421',
        text: 'New Time Entry',
        callback: function(t) {
          return t.popup({
            title: 'New Time Entry',
            url: 'https://cajacko.github.io/trello-timesheet/form.html',
          });
        },
      },
    ];
  },
});
