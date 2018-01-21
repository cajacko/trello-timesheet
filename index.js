var GRAY_ICON =
  'https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-gray.svg';

TrelloPowerUp.initialize({
  'attachment-sections': function(t, options) {
    // options.entries is a list of the attachments for this card
    // you can look through them and 'claim' any that you want to
    // include in your section.

    // we will just claim urls for Yellowstone
    var claimed = options.entries.filter(function(attachment) {
      return attachment.url.indexOf('http://www.nps.gov/yell/') === 0;
    });

    // you can have more than one attachment section on a card
    // you can group items together into one section, have a section
    // per attachment, or anything in between.
    if (claimed && claimed.length > 0) {
      // if the title for your section requires a network call or other
      // potentially lengthy operation you can provide a function for the title
      // that returns the section title. If you do so, provide a unique id for
      // your section
      return [
        {
          id: 'Yellowstone', // optional if you aren't using a function for the title
          claimed: claimed,
          icon: GRAY_ICON, // Must be a gray icon, colored icons not allowed.
          title: 'Example Attachment Section: Yellowstone',
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
    } else {
      return [];
    }
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
