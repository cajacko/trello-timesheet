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

  listenTo(ref, callback) {
    console.log('listenTo', ref);

    const parent = this.database().ref(ref);

    parent.on('value', function(snapshot) {
      callback(snapshot.val());
    });

    return parent;
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

  updateCardTimes({ times, datesByCard, cardsByDate }) {
    console.log('Database - updateCardTimes', times, datesByCard, cardsByDate);

    var updates = {};

    Object.keys(times).forEach(timeId => {
      updates[`/times/${timeId}`] = times[timeId];
    });

    Object.keys(datesByCard).forEach(cardId => {
      const times = datesByCard[cardId];

      Object.keys(times).forEach(dateString => {
        updates[`/datesByCard/${cardId}/${dateString}`] = true;
      });
    });

    Object.keys(cardsByDate).forEach(dateString => {
      const times = cardsByDate[dateString];

      Object.keys(times).forEach(cardId => {
        updates[`/cardsByDate/${dateString}/${cardId}`] = true;
      });
    });

    return this.database()
      .ref()
      .update(updates);
  }
}

export default Database;
