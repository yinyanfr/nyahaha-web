import hmacSHA256 from 'crypto-js/hmac-sha256';
import sha256 from 'crypto-js/sha256';
import Hex from 'crypto-js/enc-hex';

const { UMI_APP_TG_BOT_TOKEN } = process.env;

function sortQueryAlphabetically(query: LoginQuery) {
  const keys = Object.keys(query).filter(e => e !== 'hash');
  keys.sort((a, b) => a[0].localeCompare(b[0]));
  const splitter = '\n';
  const sortedString = keys
    .map(e => `${e}=${query[e as keyof LoginQuery]}`)
    .join(splitter);
  return sortedString;
}

export function verifyTGLoginHash(query?: LoginQuery) {
  if (!query) {
    throw new Error('INVALID_LOGIN_QUERY');
  }
  const sortedString = sortQueryAlphabetically(query);
  if (!UMI_APP_TG_BOT_TOKEN) {
    throw new Error('NO_BOT_TOKEN');
  }
  const bytes = hmacSHA256(sortedString, sha256(UMI_APP_TG_BOT_TOKEN));
  return bytes.toString(Hex);
}
