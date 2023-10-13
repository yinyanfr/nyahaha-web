import hmacSHA256 from 'crypto-js/hmac-sha256';
import sha256 from 'crypto-js/sha256';
import Hex from 'crypto-js/enc-hex';

function sortQueryAlphabetically(query: LoginQuery) {
  const keys = Object.keys(query);
  keys.sort((a, b) => a[0].localeCompare(b[0]));
  const splitter = '\n';
  const sortedString = keys
    .map(e => `${e}=${query[e as keyof LoginQuery]}`)
    .join(splitter);
  return sortedString;
}

export function verifyTGLoginHash(query: LoginQuery) {
  const sortedString = sortQueryAlphabetically(query);
  console.log(sortedString);

  const bytes = hmacSHA256(sortedString, sha256(process.env.BOT_TOKEN as any));
  return bytes.toString(Hex);
}
