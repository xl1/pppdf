const puppeteer = require('puppeteer');
const express = require('express');

const app = express();
const server = app.listen(8080, () => console.log('listening'));

function renderPage(page, query) {
  if (query.url) {
    return page.goto(query.url, {
      timeout: 10 * 1000, // ms
      waitUntil: 'networkidle0'
    });
  } else if (query.html) {
    const dataUri = 'data:text/html;charset=utf-8,' + query.html;
    return page.goto(dataUri, {
      timeout: 10 * 1000, // ms
      waitUntil: 'networkidle0'
    });
  }
}

async function ppp(next, func) {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  try {
    await func(await browser.newPage());
  } catch (e) {
    next(e);
  } finally {
    browser.close();
  }
}

app.get('/pdf', (req, res, next) => {
  ppp(next, async page => {
    await renderPage(page, req.query);
    res.writeHead(200, {
      'Content-Type': 'application/pdf'
    });
    res.end(await page.pdf());
  });
});

app.get('/png', (req, res, next) => {
  ppp(next, async page => {
    await renderPage(page, req.query);
    res.writeHead(200, {
      'Content-Type': 'image/png'
    });
    res.end(await page.screenshot({
      fullPage: true
    }));
  });
});
