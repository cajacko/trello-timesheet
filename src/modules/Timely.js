import Trello from './Trello';
import moment from 'moment';
let accountId;

class Timely {
  static isAuthenticated() {
    return Timely.getAccountId(true);
  }

  static authenticatedFetch(endpoint, options = {}) {
    return Trello.getData('access_token')
      .then(
        token =>
          !token
            ? Promise.reject('No Access Token Defined')
            : fetch(endpoint, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                ...options,
              }),
      )
      .then(response => response.json())
      .then(response => {
        console.debug(response);
        return response;
      });
  }

  static getOAuthCodeUrl() {
    const redirect = Timely.getAuthRedirectUrl(true);

    const applicationId = process.env.REACT_APP_TIMELY_APPLICATION_ID;

    return `https://api.timelyapp.com/1.1/oauth/authorize?response_type=code&redirect_uri=${redirect}&client_id=${applicationId}`;
  }

  static getOAuthToken(code) {
    const redirect = Timely.getAuthRedirectUrl();

    const body = JSON.stringify({
      redirect_uri: redirect,
      code,
      client_id: process.env.REACT_APP_TIMELY_APPLICATION_ID,
      client_secret: process.env.REACT_APP_TIMELY_APPLICATION_SECRET,
      grant_type: 'authorization_code',
    });

    return fetch('https://api.timelyapp.com/1.1/oauth/token', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body,
    })
      .then(response => response.json())
      .then(
        ({ access_token, refresh_token, ...props }) =>
          access_token || Promise.reject('No auth token'),
      );
  }

  static getAuthRedirectUrl(encode) {
    let url;

    if (window.location.hostname.includes('localhost')) {
      url = `${window.location.protocol}//${window.location.hostname}${
        window.location.port ? `:${window.location.port}` : ''
      }/auth/callback`;
    } else {
      url = `${process.env.REACT_APP_PRODUCTION_URL}/auth/callback`;
    }

    return encode ? encodeURIComponent(url) : url;
  }

  static getAccountId(forceFetch = false) {
    if (!forceFetch) {
      if (accountId) return Promise.resolve(accountId);
    }

    return Timely.authenticatedFetch(
      'https://api.timelyapp.com/1.1/accounts',
    ).then(accounts => {
      const account = accounts.find(({ name }) => name === 'Curious Squid Co');

      accountId = account && account.id;
      return accountId;
    });
  }

  static getEntries(date) {
    const day = date.format('YYYY-MM-DD');

    return Timely.getAccountId()
      .then(accountId =>
        Timely.authenticatedFetch(
          `https://api.timelyapp.com/1.1/${accountId}/events?day=${day}`,
        ),
      )
      .then(response =>
        response
          .sort((a, b) => {
            if (a.to && b.to) {
              return new Date(a.to) - new Date(b.to);
            }

            if (a.from && b.from) {
              return new Date(a.from) - new Date(b.from);
            }

            return 0;
          })
          .map(({ note, from, to }) => ({
            title: note || 'No Title Set',
            startTime: from && moment(from).format('HH:mm'),
            endTime: to && moment(to).format('HH:mm'),
          })),
      );
  }
}

export default Timely;
