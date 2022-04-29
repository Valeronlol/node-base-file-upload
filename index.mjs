import http from 'http'
import fs from 'fs/promises'
import formidable from 'formidable'
import {nanoid} from 'nanoid'

const server = http.createServer(async (req, res) => {
  if (req.url === '/upload' && req.method === 'POST') {
    const form = formidable({
      uploadDir: `${process.cwd()}/uploads`,
      multiples: true,
      filename: ($, _, {originalFilename}) => `${nanoid()}_${originalFilename}`,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
        res.end(String(err));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      const success = await fs.readFile('success.html')
      res.end(success);
    });

    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/html' });
  const html = await fs.readFile('index.html')
  res.end(html);
});

server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000/ ...');
});