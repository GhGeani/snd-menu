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
        color: #222 !important;
        border: 0 !important;
      }
      body {
        font-family: 'Arial Rounded MT Bold', Arial, sans-serif !important;
        font-size: 15px !important;
        background: #fcfcfc !important;
        color: #222 !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      main.menu-body > section:first-child {
        padding-top: 0 !important;
      }
      main.menu-body > section:last-child {
        padding-bottom: 0 !important;
      }
      .menu-header, .heading-wrapper {
        text-align: center;
        margin-bottom: -10px !important;
        padding: 10px 0 8px 0 !important;
        background: #fafafa !important;
      }
      h1, h2, h3, .section-title, li.active {
        font-size: 22px !important;
        font-weight: bold !important;
        text-transform: uppercase !important;
        margin-bottom: 10px !important;
        letter-spacing: 1px;
        color: #222 !important;
      }
      .menu-body {
        width: 100%;
        max-width: 800px;
        margin: 0 auto;
        padding: 0 10px;
      }
      .menu-body section {
        opacity: 1 !important;
        height: auto !important;
        margin-bottom: 10px !important;
        padding-bottom: 0 !important;
        page-break-after: avoid;
      }
      .select-type-wrapper, .menu-header > ul > li:not(.active) {
        display: none !important;
      }
      .menu-item summary {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        width: 100%;
        padding-bottom: 0 !important;
        background: none;
        border: none;
      }
      .padd-t-1 {
        padding: 0 !important;
      }
      .menu-item .name-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        width: 100%;
      }
      .menu-item .card-title {
        display: flex !important;
        justify-content: space-between !important;
        align-items: baseline !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        background: none !important;
        border: none !important;
      }
      .menu-item .title {
        font-weight: 600 !important;
        font-size: 16px !important;
        color: #111 !important;
        text-align: left !important;
        flex: 1 !important;
      }
      .menu-item .price {
        color: #ff7300 !important;
        font-weight: bold !important;
        font-size: 16px !important;
        min-width: 60px !important;
        text-align: right !important;
        white-space: nowrap !important;
        margin-left: 16px !important;
      }
      .menu-item p {
        font-size: 13px !important;
        color: #666 !important;
        font-style: italic !important;
        margin: 0 0 8px 0 !important;
        text-align: left !important;
      }
      .menu-item img {
        display: none !important;
      }
      .menu-item {
        break-inside: avoid;
        page-break-inside: avoid;
      }
      @media print {
        body {
          margin: 0 !important;
        }
        .menu-body {
          padding: 0 !important;
        }
      }
    `
  });

  await page.emulateMedia({ media: 'screen' });
  await page.pdf({
    path: output,
    format: 'A4',
    // printBackground: true,
    preferCSSPageSize: true,
    margin: {
      top: '1cm',
      bottom: '1cm',
      left: '1cm',
      right: '1cm'
    },
    scale: 1,
  });

  browser.close();
  console.log('Done, check: ' + output)
})();