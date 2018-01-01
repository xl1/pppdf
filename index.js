const puppeteer = require('puppeteer');
const express = require('express');

const app = express();
const server = app.listen(8080, () => console.log('listening'));

app.get('/pdf', async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(req.query.url, {
    timeout: 10 * 1000, // ms
    waitUntil: 'networkidle2'
  });
  const buffer = await page.pdf();
  browser.close();
  res.writeHead(200, {
    'Content-Type': 'application/pdf'
  });
  res.end(buffer);
});

