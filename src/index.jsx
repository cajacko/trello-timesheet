import * as firebase from 'firebase';

firebase.initializeApp({ databaseURL: process.env.DATABASE_URL });

console.log('yay');

// firebase
//   .database()
//   .ref('cards/2')
//   .set({
//     username: 'My username',
//     email: 'My email',
//   });
