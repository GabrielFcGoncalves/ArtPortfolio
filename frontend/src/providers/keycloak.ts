import Keycloak from 'keycloak-js'
import { isAppRoute } from '../lib/path'

const path = typeof window !== 'undefined' ? (window.location.pathname || '/') : '/';
const isAdminRoute =
  isAppRoute(path, "/admin");

const keycloak = new Keycloak({
  url: process.env.NEXT_PUBLIC_IAM_URL || '',
  realm: 'platform',
  clientId: 'react',
});


export default keycloak
