const express = require('express');
const path = require('path');
const puppeteer = require('puppeteer');
const execFile = require('child_process').execFile;
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;
//-----------------------------------------
const { createCanvas } = require('canvas');




app.get('/getss/:url', async (req, res) => {
  const url = req.params.url;

  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 600, height: 800 });
    await page.goto(url);

    const screenshotPath = '/tmp/screenshot.png';

    await page.screenshot({ path: screenshotPath });
    await browser.close();

    await convert(screenshotPath);

    const screenshot = fs.readFileSync(screenshotPath);

    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': screenshot.length,
    });

    return res.end(screenshot);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

function convert(filename) {
  return new Promise((resolve, reject) => {
    const args = [filename, '-gravity', 'center', '-extent', '600x800', '-colorspace', 'gray', '-depth', '8', filename];
    execFile('convert', args, (error, stdout, stderr) => {
      if (error) {
        console.error({ error, stdout, stderr });
        reject();
      } else {
        resolve();
      }
    });
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//----------------------------------------
/*
express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => {
    const html = `<html>
      <head>
        <title>Thanks Page</title>
        <style>
          body {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
          }
        </style>
      </head>
      <body>
        <h1>Thanks to Suhail Ser</h1>
      </body>
    </html>`;
    
    res.type('html').send(html);
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));


*/

 
 /*
express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/getss/:url', async (req, res) => {
    const givenurl = req.params.url;
    console.log("Given Url Is : ",givenurl)
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 600, height: 800 });
    await page.goto(givenurl);
    await page.screenshot({
      path: '/tmp/screenshot.png',
    });

    await browser.close();

    await convert('/tmp/screenshot.png');
    screenshot = fs.readFileSync('/tmp/screenshot.png');

    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': screenshot.length,
    });
    return res.end(screenshot);
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));


function convert(filename) {
  return new Promise((resolve, reject) => {
    const args = [filename, '-gravity', 'center', '-extent', '600x800', '-colorspace', 'gray', '-depth', '8', filename];
    execFile('convert', args, (error, stdout, stderr) => {
      if (error) {
        console.error({ error, stdout, stderr });
        reject();
      } else {
        resolve();
      }
    });
  });
}

*/

