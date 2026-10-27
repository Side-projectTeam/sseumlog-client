/** 마지막 글자에 받침이 있는지 */
function hasBatchim(word: string) {
  const code = word.charCodeAt(word.length - 1) - 0xac00;
  return code >= 0 && code <= 11171 && code % 28 !== 0;
}

/** 이/가, 을/를 같은 조사를 단어에 맞게 붙인다. josa("기쁨", "이", "가") → "기쁨이" */
export function josa(word: string, withBatchim: string, withoutBatchim: string) {
  return word + (hasBatchim(word) ? withBatchim : withoutBatchim);
}

/** 조사만 돌려준다. particle("기쁨", "을", "를") → "을" */
export function particle(word: string, withBatchim: string, withoutBatchim: string) {
  return hasBatchim(word) ? withBatchim : withoutBatchim;
}
