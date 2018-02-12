import getAuthRedirectUrl from '../helpers/getAuthRedirectUrl';

class Timely {
  static isAuthenticated() {
    return false;
  }

  static getOAuthCode() {
    const redirect = getAuthRedirectUrl('got-oauth-code');

    const applicationId = process.env.REACT_APP_TIMELY_APPLICATION_ID;

    window.location.href = `https://api.timelyapp.com/1.1/oauth/authorize?response_type=code&redirect_uri=${redirect}&client_id=${applicationId}`;
  }

  static gotOAuthCode({ code }) {
    Timely.getOAuthToken(code);
  }

  static getOAuthToken(code) {
    console.warn(code);

    const redirect = getAuthRedirectUrl('got-oauth-token');

    console.warn(redirect);

    const body = `redirect_uri=${redirect}&code=${code}&client_id=${
      process.env.REACT_APP_TIMELY_APPLICATION_ID
    }&client_secret=${
      process.env.REACT_APP_TIMELY_APPLICATION_SECRET
    }&grant_type=authorization_code`;

    console.warn(body);

    fetch('https://api.timelyapp.com/1.1/oauth/token', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'text/plain',
      }),
      body,
    }).then(response => response.json());
  }
}

export default Timely;
