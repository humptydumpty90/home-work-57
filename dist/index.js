"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_http_1 = __importDefault(require("node:http"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const querystring_1 = __importDefault(require("querystring"));
const PORT = process.env.PORT || 3000;
function setHeaders(res) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');
}
const server = node_http_1.default.createServer((req, res) => {
    const { method, url, headers } = req;
    if (method === 'GET') {
        const fileName = url === '/' ? 'index' : url?.slice(1);
        const routePath = node_path_1.default.join(__dirname, '..', 'routes', `${fileName}.html`);
        const readStream = node_fs_1.default.createReadStream(routePath);
        if (url === '/') {
            setHeaders(res);
            res.statusCode = 200;
            readStream.pipe(res);
            return;
        }
        if (url === '/about') {
            setHeaders(res);
            res.statusCode = 200;
            readStream.pipe(res);
            return;
        }
        if (url === '/contact') {
            setHeaders(res);
            res.statusCode = 200;
            readStream.pipe(res);
            return;
        }
    }
    if (method === 'POST' && url === '/submit') {
        const writeStream = node_fs_1.default.createWriteStream(node_path_1.default.join(__dirname, '..', 'log.txt'));
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
            if (Buffer.byteLength(body) > 1 * 1024 * 1024) {
                res.statusCode = 413;
                res.end('<h1>413 - Payload Too Large</h1>');
                req.socket.destroy();
            }
        });
        req.on('end', () => {
            const parsedData = querystring_1.default.parse(body);
            const { email, name } = parsedData;
            console.log('Received:', parsedData);
            if (!name || !email) {
                res.statusCode = 400;
                res.end('<h1>400 - Bad Request</h1><p>Invalid form data</p>');
                return;
            }
            setHeaders(res);
            res.statusCode = 200;
            res.end(`<h1>Form Submitted</h1><p>Name: ${name}</p><p>Email: ${email}</p>`);
            writeStream.write(JSON.stringify({ name, email }));
        });
        return;
    }
    res.statusCode = 404;
    res.end('<h1>404 - Not Found</h1>');
});
server.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map