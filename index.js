const express = require('express');
const path = require('path');
//const puppeteer = require('puppeteer');
//const execFile = require('child_process').execFile;
const fs = require('fs');

const PORT = process.env.PORT || 3000;
//-----------------------------------------

const { execFile } = require('child_process');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/getss/:url', async (req, res) => {
  const { url } = req.params;
  const screenshotPath = '/tmp/screenshot.png';
  
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 600, height: 800 });
    await page.goto(url);
    await page.screenshot({ path: screenshotPath });
    await browser.close();

    await convert(screenshotPath);

    const screenshot = fs.readFileSync(screenshotPath);

    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': screenshot.length,
    });
    res.end(screenshot);
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
  console.log(`Server is running on http://localhost:${PORT}`);
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
  .get('/', async (req, res) => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 600, height: 800 });
    await page.goto(process.env.SCREENSHOT_URL || 'https://darksky.net/details/40.7127,-74.0059/2021-1-6/us12/en');
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
