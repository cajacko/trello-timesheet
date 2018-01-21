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

      fetch(
        'https://script.google.com/a/charliejackson.com/macros/s/AKfycbx1wqNJ0XN0alA-5_E3E2gynKedBqeVSCmIa_Ai5DuJMmw28FI/exec',
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'no-cors',
          method: 'POST',
          redirect: 'follow',
          body: JSON.stringify(payload),
        },
      )
        .then(function(res) {
          if (res.status === 200) {
            t.closePopup();
          } else {
            error(new Error("Non 200 status, probably didn't save"));
          }
        })
        .catch(function(e) {
          error(e);
        });
    });
});
