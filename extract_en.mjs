import { translations } from './src/locales/translations.js';
import fs from 'fs';

const enDict = translations.en;
fs.writeFileSync('en_dict_clean.json', JSON.stringify(enDict, null, 2), 'utf8');
console.log('Successfully dumped en_dict_clean.json');
