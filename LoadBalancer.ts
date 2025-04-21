import * as http from 'http';
import { Strategy } from './model/Strategies';

export class LoadBalancer{
    private URLS: string[];
    private currentStrategy: Strategy;
    private currentIndex: number = 0;
    private connectionCounts: Map<string, number> = new Map();
    
    constructor(urls: string[],portNumber:number, strategy: Strategy = Strategy.ROUND_ROBIN){
        this.URLS = urls;
        this.currentStrategy = strategy
    }
    addURL(url: string){
        this.URLS.push(url)
    }
    removeURL(url: string){
        this.URLS = this.URLS.filter((u)=> u !== url)
    }
    setStrategy(strategy: Strategy) {
        this.currentStrategy = strategy
    }

    getSortedUrlConnections(): [string, number][] {
        const urlConnections = Array.from(this.connectionCounts.entries());
        return urlConnections.sort(([_, countA], [__, countB]) => countA - countB);
    }

    nextURL(): string {
        if(this.currentStrategy == Strategy.ROUND_ROBIN) return this.currentIndex == this.URLS.length - 1  || this.currentIndex ==  0 ?  this.URLS[0]: this.URLS[this.currentIndex++];
        if(this.currentStrategy == Strategy.LEAST_CONNECTIONS){
            let sortedByConnections = this.getSortedUrlConnections();
            const leastConnectedUrl = sortedByConnections[0]?.[0];
            return leastConnectedUrl || this.URLS[0];
        }
        if(this.currentStrategy == Strategy.WEIGHTED){
            // I didnt implement a weight strategy :( will look at this later)
        }
        return this.URLS[0];
    }
    
    async getServerConnection(url: string): Promise<number> {
        try {
            const response = await fetch(`${url}/health`);
            const data = await response.json();
            return data.connections;
        } catch (error) {
            console.error(`Failed to get connections from ${url}:`, error);
            return -1
        }
    }
    sendNext(strategy: Strategy): any{
       return this.nextURL()
    }
    startServer(port: number = 3000) {
      const server = http.createServer(async (req: http.IncomingMessage, res: http.ServerResponse) => {
        const targetUrl = await this.nextURL();
        
        try {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            await new Promise(resolve => req.on('end', resolve));

            const response = await fetch(targetUrl + req.url, {
                method: req.method,
                headers: req.headers as HeadersInit,
                body: req.method !== 'GET' ? body : ''
            });

            if (response.ok) {
                const currentCount = this.connectionCounts.get(targetUrl) || 0;
                this.connectionCounts.set(targetUrl, currentCount + 1);
            }

            for (const [key, value] of response.headers.entries()) {
                res.setHeader(key, value);
            }

            res.statusCode = response.status;
            const data = await response.text();
            res.end(data);

            const count = this.connectionCounts.get(targetUrl) || 0;
            this.connectionCounts.set(targetUrl, Math.max(0, count - 1));
        } catch (error) {
            console.error(`Error forwarding request to ${targetUrl}:`, error);
            res.statusCode = 500;
            res.end('Internal Server Error');
        }
      });

      server.listen(port, () => {
          console.log(`Load balancer running on port ${port}`);
      });
    }
}

