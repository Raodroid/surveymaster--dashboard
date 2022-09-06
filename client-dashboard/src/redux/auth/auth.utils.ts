export default class AuthUtils {
  static isLocalhost(): boolean {
    const host = window.location.host;
    return host.includes('localhost') || host.includes('127.0.0.1');
  }
  static getsubdomain(): string {
    const host = window.location.host;
    if (host === process.env.REACT_APP_DOMAIN || AuthUtils.isLocalhost())
      return process.env.REACT_APP_DEFAULT_SUBDOMAIN as string;
    const splitToken = host.split(`.${process.env.REACT_APP_DOMAIN}`);
    if (
      splitToken.length === 2 &&
      !!splitToken[0] &&
      splitToken[0] !== process.env.REACT_APP_DOMAIN
    ) {
      return splitToken[0];
    }
    return process.env.REACT_APP_DEFAULT_SUBDOMAIN as string;
  }

  static getUserLandingPageUrl() {
    return `${process.env.REACT_APP_LANDING_PAGE_PROTOCOL}://${process.env.REACT_APP_LANDING_PAGE_DOMAIN}`;
  }
}
