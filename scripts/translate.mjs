import fs from 'fs';
import path from 'path';
import { translate } from '@vitalets/google-translate-api';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputFile = path.resolve(__dirname, '../menu/ro.json');
const outputLangs = ['fr', 'es', 'de'];


const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const translateRecursive = async (data, to) => {
  if (typeof data === 'string') {
    await sleep(5000);
    const res = await translate(data, { to });
    return res.text;
  } else if (Array.isArray(data)) {
    const result = [];
    for (const item of data) {
      result.push(await translateRecursive(item, to));
    }
    return result;
  } else if (typeof data === 'object' && data !== null) {
    const result = {};
    for (const key in data) {
      const translatedKey = await translateRecursive(key, to);
      result[translatedKey] = await translateRecursive(data[key], to);
    }
    return result;
  } else {
    return data;
  }
};

(async () => {
  const raw = fs.readFileSync(inputFile, 'utf8');
  const json = JSON.parse(raw);

  for (const lang of outputLangs) {
    console.log(`Traducere în ${lang}...`);
    const translated = await translateRecursive(json, lang);
    const outputPath = path.resolve(__dirname, `../menu/${lang}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(translated, null, 2));
    console.log(`Salvat în ${lang}.json`);
  }
})();