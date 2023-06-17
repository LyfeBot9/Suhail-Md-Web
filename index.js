const express = require('express');
const path = require('path');
const puppeteer = require('puppeteer');
const execFile = require('child_process').execFile;
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;
//-----------------------------------------
const { createCanvas, loadImage, registerFont } = require('canvas');
const GIFEncoder = require('gifencoder');
registerFont(path.join(__dirname, 'public', 'Pacifico.ttf'), { family: 'Pacifico' });

 
 
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
//----------------------------------------------------------------------------
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
    const fontFamily = 'Pacifico';
    ctx.font = `${fontSize}px ${fontFamily}`;
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
    let lines = [];
    let line = '';
    let y = centerY;

    // Iterate through the words and add them to the lines array
    for (const word of words) {
      const testLine = line + word + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth) {
        lines.push(line.trim());
        line = word + ' ';
      } else {
        line = testLine;
      }
    }

    // Push the remaining line to the lines array
    lines.push(line.trim());

    // Calculate the total height occupied by the text
    const totalTextHeight = lines.length * fontSize;

    // Calculate the y-position for the first line
    const firstLineY = centerY - totalTextHeight / 2;

    // Draw each line of text
    lines.forEach((line, index) => {
      const lineY = firstLineY + index * fontSize;
      ctx.fillText(line, centerX, lineY);
    });

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
  //-------------------------------------------------------------
  .get('/ttp2/:text', async (req, res) => {
    const text = req.params.text;
    console.log("Text For TTP : " + text);
    
    // Create a new canvas with dimensions 400x400
    const canvas = createCanvas(200, 200);
    const ctx = canvas.getContext('2d');

    // Set canvas background color to black
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set text properties
    const fontSize = 40;
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
      } else {    line = testLine;   }
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
  //--------------------------------------------------------------        attp
  /*
.get('/ttp/:text', async (req, res) => {
  const text = req.params.text;
  console.log("Text For TTP : " + text);

  const { createCanvas } = require('canvas');
  const GIFEncoder = require('gifencoder');
  const fs = require('fs');
  const path = require('path');

  const colorFrames = [
    [255, 0, 0], // Red
    [0, 255, 0], // Green
    [0, 0, 255] // Blue
  ];

  const getColorFrame = (index) => {
    const colorIndex = index % colorFrames.length;
    return colorFrames[colorIndex];
  };

  const createTextGIF = (text) => {
    const words = text.split(' ');

    // Set canvas dimensions
    const canvasWidth = 400;
    const canvasHeight = 400;

    // Set text properties
    const fontSize = 30;
    const fontFamily = 'Pacifico';

    // Create a new GIF encoder
    const encoder = new GIFEncoder(canvasWidth, canvasHeight);
    encoder.createReadStream().pipe(fs.createWriteStream('public/text.gif'));

    encoder.start();
    encoder.setRepeat(0); // 0 for repeat, -1 for no-repeat
    encoder.setDelay(500); // Delay between frames (in ms)

    // Iterate through frames and set the color
    for (let frameIndex = 0; frameIndex < colorFrames.length; frameIndex++) {
      const frameColor = getColorFrame(frameIndex);

      // Create a new canvas for each frame
      const canvas = createCanvas(canvasWidth, canvasHeight);
      const ctx = canvas.getContext('2d');

      // Set canvas background color to black
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Set text properties
      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';

      // Calculate the center position of the canvas
      const centerX = canvasWidth / 2;
      const centerY = canvasHeight / 2;

      // Set the color for the frame
      const [r, g, b] = frameColor;
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;

      // Variables to track the current line and y-position
      let lines = [];
      let line = '';
      let y = centerY;

      // Iterate through the words and add them to the lines array
      for (const word of words) {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > canvasWidth * 0.8) {
          lines.push(line.trim());
          line = word + ' ';
        } else {
          line = testLine;
        }
      }

      // Push the remaining line to the lines array
      lines.push(line.trim());

      // Calculate the total height occupied by the text
      const totalTextHeight = lines.length * fontSize;

      // Calculate the y-position for the first line
      const firstLineY = centerY - totalTextHeight / 2;

      // Draw each line of text
      lines.forEach((line, index) => {
        const lineY = firstLineY + index * fontSize;
        ctx.fillText(line, centerX, lineY);
      });

      // Add the frame to the GIF encoder
      encoder.addFrame(ctx);
    }

    encoder.finish();
  };

  // Create the GIF with changing colors for the text
  createTextGIF(text);

  // Send the GIF as the response
  const gifPath = path.join(__dirname, 'public', 'text.gif');
  const gif = fs.readFileSync(gifPath);
  res.writeHead(200, {
    'Content-Type': 'image/gif',
    'Content-Length': gif.length,
  });
  res.end(gif);
});
*/
  //-----------------------------------------------------------------
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

