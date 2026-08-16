const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = { '.html':'text/html', '.js':'application/javascript', '.css':'text/css', '.json':'application/json', '.png':'image/png', '.jpg':'image/jpeg', '.svg':'image/svg+xml', '.ico':'image/x-icon' };
const root = __dirname;
http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
  let filePath = path.join(root, urlPath === '/' ? 'index.html' : urlPath);
  /* Serve index.html for a directory, the way Netlify does - otherwise the
     marketing site under web/ can only be previewed at its full filename
     locally while the deployed site answers on the bare path. */
  try { if (fs.statSync(filePath).isDirectory()) filePath = path.join(filePath, 'index.html'); }
  catch (e) { /* fall through to the 404 below */ }
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(3000, () => console.log('GharSeva running at http://localhost:3000'));
