import * as deepl from 'deepl-node';
import fs from 'fs';

const outputs = ['en-US', 'tr', 'bg', 'pl', 'hu'];
const sourceLang = 'ro';
const roJsonPath = './menu/ro.json';
const roJsonContent = fs.readFileSync(roJsonPath, 'utf-8');
const authKey = "f7934036-fc11-478e-998e-8976a821d726:fx";
const deeplClient = new deepl.DeepLClient(authKey);

const sleep = (ms = 500) => {
	return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
	const parsedMenu = JSON.parse(roJsonContent).Meniu;

	for (const lg of outputs) {
		console.log('Starting translation in ' + lg);
		const Meniu = {};
		for (const key in parsedMenu) {
			console.log('Translate - ' + key);
			const subcategory = parsedMenu[key];
			if (Array.isArray(subcategory)) {
				const translatedElemsArray = [];
				for (const item of subcategory) {
					for (const prop in item) {
						if (prop === 'name' || prop === 'description') {
							try {
								const response = await deeplClient.translateText(item[prop], sourceLang, lg);
								console.log('--------------------');
								console.log(item[prop] + ' -> ' + response.text);
								console.log('--------------------');
								item[prop] = response.text;
								await sleep();
							} catch (error) {
								console.log('Error at: ' + prop + ' of ' + item[prop]);
								console.log(error);
							}
						}
					}
					translatedElemsArray.push(item);
				}
				Meniu[key] = translatedElemsArray;
			} else {
				for (const subkey in subcategory) {
					const items = subcategory[subkey];
					const translatedItems = [];
					for (const item of items) {
						for (const prop in item) {
							if (prop === 'name' || prop === 'description') {
								try {
									const response = await deeplClient.translateText(item[prop], sourceLang, lg);
									console.log('--------------------');
									console.log(item[prop] + ' -> ' + response.text);
									console.log('--------------------');
									item[prop] = response.text;
									await sleep();
								} catch (error) {
										console.log('Error at: ' + prop + ' of ' + item[prop]);
										console.log(error);
								}
							}
						}
						translatedItems.push(item);
					}
					Meniu[subkey] = translatedItems;
				}
			}
		}
		const outputPath = `./menu/${lg}.json`;
		fs.writeFile(outputPath, JSON.stringify(Meniu), err => {
			if (err) {
				console.log(err);
			} else {
				console.log(lg + ' translation complete. Check: ' + outputPath)
			}
		});
	};
})();
