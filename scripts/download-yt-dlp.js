const fs = require('fs');
const path = require('path');
const https = require('https');
const os = require('os');

// Only run on Linux (Vercel uses Linux)
if (os.platform() !== 'linux') {
  console.log('Not running on Linux. Skipping standalone yt-dlp download.');
  process.exit(0);
}

const BIN_DIR = path.join(__dirname, '..', 'node_modules', 'youtube-dl-exec', 'bin');
const FILE_PATH = path.join(BIN_DIR, 'yt-dlp');
const DOWNLOAD_URL = 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux';

console.log(`Downloading standalone yt-dlp binary for Linux to ${FILE_PATH}...`);

if (!fs.existsSync(BIN_DIR)) {
  fs.mkdirSync(BIN_DIR, { recursive: true });
}

const file = fs.createWriteStream(FILE_PATH);

https.get(DOWNLOAD_URL, (response) => {
  if (response.statusCode === 301 || response.statusCode === 302) {
    // Handle redirect
    https.get(response.headers.location, (res) => {
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        fs.chmodSync(FILE_PATH, '755');
        console.log('yt-dlp downloaded and made executable.');
      });
    }).on('error', (err) => {
      fs.unlinkSync(FILE_PATH);
      console.error(`Error downloading yt-dlp: ${err.message}`);
      process.exit(1);
    });
  } else {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      fs.chmodSync(FILE_PATH, '755');
      console.log('yt-dlp downloaded and made executable.');
    });
  }
}).on('error', (err) => {
  fs.unlinkSync(FILE_PATH);
  console.error(`Error downloading yt-dlp: ${err.message}`);
  process.exit(1);
});
