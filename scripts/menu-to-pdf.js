const { chromium } = require('playwright');
const path = require('path');

const output = path.resolve(__dirname, '../menu.pdf');

(async () => {
  const browser = await chromium.launch();

  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:3000/');

  await page.evaluate(() => {
    document.querySelectorAll('details').forEach(detail => {
      detail.setAttribute('open', '');
    });
  });

  await page.addStyleTag({
    content: `
      @page {
        size: A4;
      }
      * {
        pointer-events: none !important;
      }
      .menu-body section {
        opacity: 1 !important;
        height: auto !important;
      }
      .select-type-wrapper {
        display: none !important;
      }
      .menu-body section, .menu-item {
        break-inside: avoid;
        page-break-inside: avoid;
      }
      .menu-body section {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    `
  });

  await page.emulateMedia({ media: 'screen' });
  await page.pdf({
    path: output,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    scale: 1.1,
  });

  browser.close();
  console.log('Done, check: ' + output)
})();