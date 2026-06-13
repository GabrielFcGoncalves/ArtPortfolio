import Keycloak, { KeycloakInitOptions } from 'keycloak-js'
import { isAppRoute } from '../lib/path'

const path = typeof window !== 'undefined' ? (window.location.pathname || '/') : '/';
const isAdminRoute =
  isAppRoute(path, "/admin");

const keycloak = new Keycloak({
  url: process.env.NEXT_PUBLIC_IAM_URL || '',
  realm: 'platform',
  clientId: 'react',
});

if (typeof window !== 'undefined') {
  const originalInit = keycloak.init.bind(keycloak);
  let initPromise: Promise<boolean> | null = null;

  keycloak.init = (options?: KeycloakInitOptions) => {
    if (initPromise) {
      return initPromise;
    }
    initPromise = originalInit(options);
    return initPromise;
  };
}

export default keycloak
