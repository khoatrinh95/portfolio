const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname)));

// Serve the homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'home-page.html'));
});

// Special handling for video files (for Safari range requests)
app.get('/assets/videos/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'assets', 'videos', req.params.filename);

  fs.stat(filePath, (err, stats) => {
    if (err) {
      console.error('File not found:', filePath);
      return res.status(404).end('File not found');
    }

    let range = req.headers.range;
    if (!range) {
      // No range header, send the entire video
      res.writeHead(200, {
        'Content-Length': stats.size,
        'Content-Type': 'video/mp4',
      });
      fs.createReadStream(filePath).pipe(res);
    } else {
      // Parse Range header
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
      const chunkSize = (end - start) + 1;

      const file = fs.createReadStream(filePath, { start, end });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stats.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4',
      });

      file.pipe(res);
    }
  });
});

// Catch all other routes (404)
app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
