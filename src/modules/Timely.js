import Trello from './Trello';

class Timely {
  static isAuthenticated() {
    return !!Trello.getData('access_token');
  }

  static getOAuthCode() {
    const redirect = Timely.getAuthRedirectUrl(true);

    const applicationId = process.env.REACT_APP_TIMELY_APPLICATION_ID;

    window.location.href = `https://api.timelyapp.com/1.1/oauth/authorize?response_type=code&redirect_uri=${redirect}&client_id=${applicationId}`;
  }

  static gotOAuthCode({ code }, { history: { push } }) {
    Timely.getOAuthToken(code, push);
  }

  static getOAuthToken(code, push) {
    const redirect = Timely.getAuthRedirectUrl();

    const body = JSON.stringify({
      redirect_uri: redirect,
      code,
      client_id: process.env.REACT_APP_TIMELY_APPLICATION_ID,
      client_secret: process.env.REACT_APP_TIMELY_APPLICATION_SECRET,
      grant_type: 'authorization_code',
    });

    fetch('https://api.timelyapp.com/1.1/oauth/token', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body,
    })
      .then(response => response.json())
      .then(({ access_token, refresh_token }) => {
        Trello.setData('access_token', access_token);
        Trello.setData('refresh_token', refresh_token);
        push('/add-time');
      });
  }

  static getAuthRedirectUrl(encode) {
    const url = `${window.location.protocol}//${window.location.hostname}${
      window.location.port ? `:${window.location.port}` : ''
    }/auth/callback`;

    return encode ? encodeURIComponent(url) : url;
  }
}

export default Timely;
