import * as http from 'http';
const port = process.argv[2] 
const serverId = process.argv[3]

const server = http.createServer((req, res) => {
    const fullUrl = `http://${req.headers.host}${req.url}`;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        message: `Hello from server ${serverId} on port ${port}`,
        path: req.url,
        method: req.method,
        fullUrl: fullUrl,
        headers: req.headers
    }));
});

server.listen(port, () => {
    console.log(`Test server ${serverId} running on port ${port}`);
}); 