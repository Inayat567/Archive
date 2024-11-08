/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    
    // const domain = '127.0.0.1';
    // must be localhost, otherwise error: Firebase Auth/unauthorized domain. Domain is not authorized
    // https://stackoverflow.com/questions/48076968/firebase-auth-unauthorized-domain-domain-is-not-authorized
    const domain = "localhost";
    const url = new URL(`http://${domain}:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}
