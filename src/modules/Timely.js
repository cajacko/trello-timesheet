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
      .then(response => {
        if (response.status >= 300 || response.status < 200) {
          console.error(response);
          throw new Error(`Non 200 response; ${response.status}`);
        }

        return response.json();
      })
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
      .then(response => {
        if (response.status >= 300 || response.status < 200) {
          console.error(response);
          throw new Error(`Non 200 response; ${response.status}`);
        }

        return response.json();
      })
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
              return new Date(b.to) - new Date(a.to);
            }

            if (a.from && b.from) {
              return new Date(b.from) - new Date(a.from);
            }

            if (!a.to && b.to) return 1;
            if (a.to && !b.to) return -1;
            if (!a.from && b.from) return 1;
            if (a.from && !b.from) return -1;

            return 0;
          })
          .map(({ note, from, to }) => ({
            title: note || 'No Title Set',
            startTime: from && moment(from).format('HH:mm'),
            endTime: to && moment(to).format('HH:mm'),
          })),
      );
  }

  static addLabel(label) {
    return Timely.authenticatedFetch(
      `https://api.timelyapp.com/1.1/${accountId}/labels`,
      {
        method: 'POST',
        body: JSON.stringify({
          name: label,
          emoji: 'http://twemoji.maxcdn.com/36x36/1f4dd.png',
        }),
      },
    );
  }

  static getLabels() {
    return Timely.getAccountId().then(accountId =>
      Timely.authenticatedFetch(
        `https://api.timelyapp.com/1.1/${accountId}/labels`,
      ),
    );
  }

  static ensureLabels(trelloLabels) {
    let labelIds = [];

    return Timely.getLabels()
      .then(timelyLabels => {
        const promises = [];

        trelloLabels.forEach(({ name, color }) => {
          const actualName = name === '' ? color : name;

          const label = timelyLabels.find(label => actualName === label.name);

          if (label) {
            labelIds.push(label.id);
          } else {
            promises.push(Timely.addLabel(actualName));
          }
        });

        return Promise.all(promises);
      })
      .then(responses => {
        responses.forEach(({ id }) => labelIds.push(id));

        return labelIds;
      });
  }

  static addEvent(from, to, duration, projectId) {
    const noTimes = !!duration;

    if (!duration) {
      duration = moment.duration(to.diff(from));
    }

    return Trello.getCard().then(({ id, labels, name }) =>
      Timely.ensureLabels(labels).then(labelIds => {
        const postData = {
          event: {
            day: from.format('YYYY-MM-DD'),
            minutes: duration.minutes(),
            hours: duration.hours(),
            from: noTimes ? undefined : from.toISOString(),
            to: noTimes ? undefined : to.toISOString(),
            note: name,
            project_id: projectId || undefined,
            external_id: id,
            label_ids: labelIds,
          },
        };

        console.warn(postData);

        return Timely.getAccountId().then(accountId =>
          Timely.authenticatedFetch(
            `https://api.timelyapp.com/1.1/${accountId}/events`,
            {
              method: 'POST',
              body: JSON.stringify(postData),
            },
          ),
        );
      }),
    );
  }

  static getProjects() {
    return Timely.getAccountId().then(accountId =>
      Timely.authenticatedFetch(
        `https://api.timelyapp.com/1.1/${accountId}/projects`,
      ),
    );
  }
}

export default Timely;
