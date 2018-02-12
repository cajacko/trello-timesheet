function getAuthRedirectUrl(stage) {
  return encodeURIComponent(
    `${window.location.protocol}//${window.location.hostname}${
      window.location.port ? `:${window.location.port}` : ''
    }/auth/${stage}`,
  );
}

export default getAuthRedirectUrl;
