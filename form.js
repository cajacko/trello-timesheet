var total = 0;
var t = TrelloPowerUp.iframe();

var context = t.getContext();
var status = document.getElementById('status');

var baseUrl =
  'https://script.google.com/a/charliejackson.com/macros/s/AKfycbx1wqNJ0XN0alA-5_E3E2gynKedBqeVSCmIa_Ai5DuJMmw28FI/exec?';

function addRow(row) {
  var date = new Date(row[0]).toISOString().split('T')[0];

  var html =
    '<tr><td>' +
    date +
    '</td><td>' +
    row[2] +
    '</td><td>' +
    row[3] +
    '</td></tr>';

  document.getElementById('tbody').insertAdjacentHTML('afterbegin', html);
  total += row[2];
  document.getElementById('total').textContent = total;
}

function error(e, errorText) {
  console.error(e);

  document.getElementById('loading').style.display = 'none';

  var error = document.getElementById('error');
  error.textContent = errorText || 'Undefined error, check logs for details';
  error.style.display = 'block';
}

function getTime() {
  var url = baseUrl;
  url += '&cardId=' + encodeURIComponent(context.card);
  url += '&member=' + encodeURIComponent(context.member);

  fetch(url, { redirect: 'follow' })
    .then(function(res) {
      if (res.ok) {
        return res.json();
      }

      console.error(res);

      error(
        new Error('Non 200 status, could not get: ' + res.status),
        'Could not get the existing timesheet, check logs for details',
      );
    })
    .then(function(data) {
      total = 0;

      for (var i = 0; i < data.length; i++) {
        addRow(data[i]);
      }

      document.getElementById('history').style.display = 'block';
      document.getElementById('loading').style.display = 'none';
    })
    .catch(function(e) {
      error(e);
    });
}

t.render(function() {
  window.timesheetDate.value = new Date().toISOString().split('T')[0];

  getTime();
});

window.timesheet.addEventListener('submit', function(event) {
  // Stop the browser trying to submit the form itself.
  event.preventDefault();

  document.getElementById('submit').style.display = 'none';

  status.textContent = 'Saving';

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

      var url = baseUrl;
      url += 'date=' + encodeURIComponent(window.timesheetDate.value);
      url += '&time=' + encodeURIComponent(window.timesheetTime.value);
      url += '&notes=' + encodeURIComponent(window.timesheetNotes.value);
      url += '&cardId=' + encodeURIComponent(context.card);
      url += '&member=' + encodeURIComponent(context.member);

      fetch(url, { redirect: 'follow' })
        .then(function(res) {
          if (res.ok) {
            return res.json();
          }

          console.error(res);

          document.getElementById('submit').style.display = 'block';
          status.textContent =
            'Could not set the new time, try and submit again, and check the timesheet to see if it has updated';

          error(
            new Error("Non 200 status, probably didn't save: " + res.status),
            'Could not set the new time, try and submit again, and check the timesheet to see if it has updated',
          );
        })
        .then(function(data) {
          status.textContent = 'Saved';
          addRow([payload.date, payload.cardId, payload.time, payload.notes]);
        })
        .catch(function(e) {
          document.getElementById('submit').style.display = 'block';
          status.textContent =
            'Undefined error, check logs for details. The entry may have saved though, check the spreadsheet';

          error(
            e,
            'Undefined error, check logs for details. The entry may have saved though, check the spreadsheet',
          );
        });
    });
});
