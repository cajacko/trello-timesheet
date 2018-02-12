import Trello from './Trello';

class Timely {
  static isAuthenticated() {
    return Timely.authenticatedFetch('https://api.timelyapp.com/1.1/accounts');
  }

  static authenticatedFetch(endpoint, options = {}) {
    return Trello.getData('access_token')
      .then(token =>
        fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          ...options,
        }),
      )
      .then(response => response.json())
      .then(response => {
        console.log(response);
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
      .then(({ access_token, refresh_token, ...props }) => {
        return Promise.all([
          Trello.setData('access_token', access_token),
          Trello.setData('refresh_token', refresh_token),
        ]);
      });
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
}

export default Timely;
