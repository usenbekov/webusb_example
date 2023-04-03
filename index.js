const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const port = process.argv[2] || 9090;

http.createServer(function (req, res) {
  const reqUrl = req.url === '/' ? '/static/index.html' : req.url;
  let pathname = `.${url.parse(reqUrl).pathname}`;
  const ext = path.parse(pathname).ext;

  fs.readFile(pathname, function(err, data){
    // Disable WebUSB API
    // res.setHeader('Permissions-Policy', 'usb=()');

    res.setHeader(
      'Content-type',
      {'.ico': 'image/x-icon', '.html': 'text/html', '.js': 'text/javascript'}[ext] || 'text/plain'
    );
    res.end(data);
  });
}).listen(parseInt(port));

console.log(`Listening on port ${port}`);
