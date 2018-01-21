var t = TrelloPowerUp.iframe();

t.render(function() {
  t.sizeTo('#timesheet').done();
  window.timesheetDate.value = new Date().toISOString().split('T')[0];
});

window.timesheet.addEventListener('submit', function(event) {
  // Stop the browser trying to submit the form itself.
  event.preventDefault();

  var context = t.getContext();

  return t
    .set('card', 'shared', 'lastSetTimesheet', window.timesheetDate.value)
    .then(function() {
      var payload = {
        date: window.timesheetDate.value,
        time: window.timesheetTime.value,
        notes: window.timesheetNotes.value,
        cardId: context.card,
        member: context.member,
      };

      console.warn(payload);

      function error(e) {
        console.error(e);
      }

      var url =
        'https://script.google.com/a/charliejackson.com/macros/s/AKfycbx1wqNJ0XN0alA-5_E3E2gynKedBqeVSCmIa_Ai5DuJMmw28FI/exec?';

      url += 'date=' + encodeURIComponent(window.timesheetDate.value);
      url += '&time=' + encodeURIComponent(window.timesheetTime.value);
      url += '&notes=' + encodeURIComponent(window.timesheetNotes.value);
      url += '&cardId=' + encodeURIComponent(context.card);
      url += '&member=' + encodeURIComponent(context.member);

      fetch(url, {
        // headers: {
        //   Accept: 'application/json',
        //   'Content-Type': 'application/json',
        // },
        method: 'GET',
        redirect: 'follow',
        // body: JSON.stringify(payload),
      })
        .then(function(res) {
          console.warn('res', res);

          if (res.ok) {
            t.closePopup();
          } else {
            console.error(res);

            error(
              new Error("Non 200 status, probably didn't save: " + res.status),
            );
          }

          return res.json();
        })
        .then(function(data) {
          console.warn(data);
        })
        .catch(function(e) {
          error(e);
        });
    });
});
