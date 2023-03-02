import { fetchExternalJSONAPI } from "./fetch";

export function yandexTranslator(text, from, to, key) {
  const url = `https://translate.yandex.net/api/v1.5/tr.json/translate?lang=${from}-${to}&key=${key}&text=${text}`;
  return fetchExternalJSONAPI(url).then((data) => data.text[0]);
}

export function googleTranslator(text, from, to, key) {
  const url = `https://translation.googleapis.com/language/translate/v2?key=${key}&q=${text}&source=${from}&target=${to}`;
  return fetchExternalJSONAPI(url).then(
    (data) => data.data.translations[0].translatedText
  );
}

export function genericGoogleTranslator(text, from, to, client, dt) {
  const url = `https://translate.googleapis.com/translate_a/single?client=${client}&sl=${from}&tl=${to}&dt=${dt}&q=${text}`;
  return fetchExternalJSONAPI(url).then((data) => data[0][0][0][0]);
}

export function inputTools(text, to) {
  const url = `https://inputtools.google.com/request?text=${text}&itc=${to}-t-i0-und&num=5`;
  return fetchExternalJSONAPI(url).then((data) => data[1][0][1]);
}
