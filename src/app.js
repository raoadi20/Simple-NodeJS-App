const http = require('http');
const url = require('url');
const config = require('./config');
const template = require('./lib/template');
const process = require('./lib/process');

http.createServer((req, resp) => {
    const urlParse = url.parse(req.url, true);
    const pathname = urlParse.pathname;
    const queryObj = urlParse.query;
    let htmlTemplate = '';
    let status = 200;
    let statusMsg = {'Content-Type': 'text/html'};

    switch (pathname) {
        case '/':
            htmlTemplate = template.root(queryObj.id);
            break;
        case '/create':
            htmlTemplate = template.create();
            break;
        case '/create_process':
            process.create(req);
            status = 302;
            statusMsg = {
                'Location': '/'
            };
            break;
        case '/update':
            htmlTemplate = template.update(queryObj.id);
            break;
        case '/update_process':
            process.update(req);
            status = 302;
            statusMsg = {
                'Location': '/'
            };
            break;
        case '/delete_process':
            process.delete(req);
            status = 302;
            statusMsg = {
                'Location': '/'
            };
            break;
        default:
            status = 404;
            htmlTemplate = 'Not found';
    }

    resp.writeHead(status, statusMsg);
    resp.end(htmlTemplate);
}).listen(config.port);
