var total = 0;
var t = TrelloPowerUp.iframe();

var context = t.getContext();

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
}

function getTime() {
  function error(e) {
    console.error(e);
  }

  context = {
    card: '5a5f3a8589cc03e516be856a',
    member: '50ed911f70cb352222002f03',
  };

  var url = baseUrl;
  url += '&cardId=' + encodeURIComponent(context.card);
  url += '&member=' + encodeURIComponent(context.member);

  fetch(url, { redirect: 'follow' })
    .then(function(res) {
      if (res.ok) {
        return res.json();
      }

      console.error(res);

      error(new Error('Non 200 status, could not get: ' + res.status));
    })
    .then(function(data) {
      total = 0;

      for (var i = 0; i < data.length; i++) {
        addRow(data[i]);
      }

      document.getElementById('history').style.display = 'block';
      document.getElementById('loading').style.display = 'none';
      document.getElementById('total').textContent = total;
    })
    .catch(function(e) {
      error(e);
    });
}

getTime();

t.render(function() {
  t.sizeTo('#timesheet').done();
  window.timesheetDate.value = new Date().toISOString().split('T')[0];

  getTime();
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

      function error(e) {
        console.error(e);
      }

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

          error(
            new Error("Non 200 status, probably didn't save: " + res.status),
          );
        })
        .then(function(data) {
          addRow([payload.date, payload.cardId, payload.time, payload.notes]);
        })
        .catch(function(e) {
          error(e);
        });
    });
});
