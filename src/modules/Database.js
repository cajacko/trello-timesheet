import { initializeApp, database } from 'firebase';

class Database {
  constructor(databaseURL) {
    console.log('Database - constructor', databaseURL);

    if (!databaseURL) throw new Error('No databaseURL specified to Database');

    initializeApp({ databaseURL });

    this.database = database;
  }

  set(ref, data) {
    console.log('Database - set', ref, data);

    return this.database()
      .ref(ref)
      .set(data);
  }

  getOnce(ref) {
    console.log('Database - getOnce', ref);

    return this.database()
      .ref(ref)
      .once('value')
      .then(snapshot => snapshot.val());
  }

  getLastUpdatedDate() {
    console.log('Database - getLastUpdatedDate');

    return this.getOnce('/lastUpdated');
  }

  setLastUpdatedDate(date) {
    console.log('Database - setLastUpdatedDate', date);

    return this.set('/lastUpdated', date.toISOString());
  }

  getCards(orderBy = 'dateLastActivity', limit = 10) {
    return this.database()
      .ref('/cards')
      .orderByChild(orderBy)
      .limitToLast(limit)
      .once('value')
      .then(snapshot => snapshot.val());
  }

  getTime(id) {
    return this.getOnce(`/times/${id}`).then(time => (time ? time.time : null));
  }

  updateCardTimes(times) {
    console.warn(times);

    var updates = {};

    Object.keys(times).forEach(cardId => {
      const dates = times[cardId];

      Object.keys(dates).forEach(date => {
        const time = dates[date];
        const cardDateId = `${cardId}-${date}`;

        updates[`/times/${cardDateId}`] = {
          cardId,
          date,
          time,
        };

        updates[`/timesByCard/${cardId}/${cardDateId}`] = true;
        updates[`/timesByDate/${date}/${cardDateId}`] = true;
      });
    });

    console.warn(updates);

    return this.database()
      .ref()
      .update(updates);
  }
}

export default Database;
