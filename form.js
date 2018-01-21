var t = TrelloPowerUp.iframe();

var context = t.getContext();

var baseUrl =
  'https://script.google.com/a/charliejackson.com/macros/s/AKfycbx1wqNJ0XN0alA-5_E3E2gynKedBqeVSCmIa_Ai5DuJMmw28FI/exec?';

t.render(function() {
  t.sizeTo('#timesheet').done();
  window.timesheetDate.value = new Date().toISOString().split('T')[0];

  function error(e) {
    console.error(e);
  }

  var url = baseUrl;
  url += '&cardId=' + encodeURIComponent(context.card);
  url += '&member=' + encodeURIComponent(context.member);

  fetch(url, { redirect: 'follow' })
    .then(function(res) {
      console.warn('res', res);

      if (res.ok) {
        return res.json();
      }

      console.error(res);

      error(new Error('Non 200 status, could not get: ' + res.status));
    })
    .then(function(data) {
      console.warn('data', data);
    })
    .catch(function(e) {
      error(e);
    });
});

window.timesheet.addEventListener('submit', function(event) {
  // Stop the browser trying to submit the form itself.
  event.preventDefault();

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

      var url = baseUrl;
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
            return res.json();
          }

          console.error(res);

          error(
            new Error("Non 200 status, probably didn't save: " + res.status),
          );
        })
        .then(function(data) {
          console.warn('data', data);
        })
        .catch(function(e) {
          error(e);
        });
    });
});
