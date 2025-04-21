import * as http from 'http';

const port = process.argv[2] || 3001;
const serverId = process.argv[3] || '1';

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        message: `Hello from server ${serverId} on port ${port}`,
        path: req.url,
        method: req.method
    }));
});

server.listen(port, () => {
    console.log(`Test server ${serverId} running on port ${port}`);
}); 