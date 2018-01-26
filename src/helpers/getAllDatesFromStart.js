import getDateStringFromDate from 'src/helpers/getDateStringFromDate';

const dayNames = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

function getAllDatesFromStart(startDate) {
  const days = [];

  for (let i = 0; i < 7; i += 1) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    days.push({
      date,
      dateString: getDateStringFromDate(date),
      day: dayNames[date.getDay()],
    });
  }

  return days;
}

export default getAllDatesFromStart;
