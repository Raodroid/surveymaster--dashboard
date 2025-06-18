export default class AuthUtils {
  static isLocalhost(): boolean {
    const host = window.location.host;
    return host.includes('localhost') || host.includes('127.0.0.1');
  }
  static getsubdomain(): string {
    const host = window.location.host;
    if (host === import.meta.env.VITE_APP_DOMAIN || AuthUtils.isLocalhost())
      return import.meta.env.VITE_APP_DEFAULT_SUBDOMAIN as string;
    const splitToken = host.split(`.${import.meta.env.VITE_APP_DOMAIN}`);
    if (
      splitToken.length === 2 &&
      !!splitToken[0] &&
      splitToken[0] !== import.meta.env.VITE_APP_DOMAIN
    ) {
      return splitToken[0];
    }
    return import.meta.env.VITE_APP_DEFAULT_SUBDOMAIN as string;
  }

  static getUserLandingPageUrl() {
    return `${import.meta.env.VITE_APP_LANDING_PAGE_PROTOCOL}://${
      import.meta.env.VITE_APP_LANDING_PAGE_DOMAIN
    }`;
  }
}
