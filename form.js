var t = TrelloPowerUp.iframe();

t.render(function() {
  t.sizeTo('#timesheet').done();
});

window.timesheet.addEventListener('submit', function(event) {
  // Stop the browser trying to submit the form itself.
  event.preventDefault();
  console.warn(window.timesheetDate.value);
  console.warn(window.timesheetTime.value);
  console.warn(window.timesheetNotes.value);

  t.closePopup();
});
