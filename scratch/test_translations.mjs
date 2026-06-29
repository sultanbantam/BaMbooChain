import { translations } from '../src/locales/translations.js';

console.log("ID overview:", translations.id.tw_tab_overview);
console.log("EN overview:", translations.en.tw_tab_overview);
console.log("JA overview:", translations.ja.tw_tab_overview);

console.log("Keys in ID:", Object.keys(translations.id).length);
console.log("Keys in EN:", Object.keys(translations.en).length);
console.log("Keys in JA:", Object.keys(translations.ja).length);
