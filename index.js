const express = require('express');
const path = require('path');
const puppeteer = require('puppeteer');
const execFile = require('child_process').execFile;
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;
//-----------------------------------------
const { createCanvas, loadImage, registerFont } = require('canvas');


 
 
express()
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
  //----------------------------------------------------------
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/getss/:url', async (req, res) => {
  const urls = req.params.url; 
    console.log("Url : " + urls) ; 
  const urll = urls.split("$")[0];
  console.error("Given URL Is: " + urll);
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 600, height: 800 });
    await page.goto(process.env.SCREENSHOT_URL || urll.replace("url?", ""));
    await page.screenshot({  path: '/tmp/screenshot.png',  });
    await browser.close();
    await convert('/tmp/screenshot.png');
    screenshot = fs.readFileSync('/tmp/screenshot.png');
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': screenshot.length,
    });
    return res.end(screenshot);
  })
  //-------------------------------------------------------------
  .get('/ttp/:text', async (req, res) => {
    const text = req.params.text;
    console.log("Text For TTP : " + text);
    
    // Create a new canvas with dimensions 400x400
    const canvas = createCanvas(400, 400);
    const ctx = canvas.getContext('2d');

    // Set canvas background color to black
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set text properties
    const fontSize = 30;
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = 'white';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    // Calculate the center position of the canvas
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Split the text into words
    const words = text.split(' ');

    // Set the maximum width for the text (to wrap to the next line)
    const maxWidth = canvas.width * 0.8;

    // Variables to track the current line and y-position
    let line = '';
    let y = centerY;

    // Iterate through the words and add them to the canvas
    for (const word of words) {
      const testLine = line + word + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth) {
        ctx.fillText(line, centerX, y);
        line = word + ' ';
        y += fontSize;
      } else {
        line = testLine;
      }
    }

    // Draw the remaining line
    ctx.fillText(line, centerX, y);

    // Convert the canvas to a PNG image
    const imagePath = path.join(__dirname, 'public', 'image.png');
    const out = fs.createWriteStream(imagePath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);

    out.on('finish', () => {
      // Read the saved image file
      const image = fs.readFileSync(imagePath);

      // Send the image as the response
      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': image.length,
      });
      res.end(image);
    });
  })
  
  
  
  
  
  .listen(PORT, () => console.log(`Listening on ${PORT}`));


function convert(filename) {
  return new Promise((resolve, reject) => {
    const args = [
  filename,
  '-gravity',
  'center',
  '-extent',
  '600x800',
  '-depth',
  '8',
  filename
];

   // const args = [filename, '-gravity', 'center', '-extent', '600x800', '-colorspace', 'gray', '-depth', '8', filename];
    execFile('convert', args, (error, stdout, stderr) => {
      if (error) {
        console.error({ error, stdout, stderr });
        reject();
      } else {   resolve();  }
    });
  });
}

///-----------------------------------------------------------------------

