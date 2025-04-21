import { LoadBalancer } from './LoadBalancer';
import { Strategy } from './model/Strategies';

// Create load balancer with two test servers
const loadBalancer = new LoadBalancer([
    'http://localhost:3001',
    'http://localhost:3002'
], 3000, Strategy.ROUND_ROBIN);

// Start the load balancer
loadBalancer.startServer(3000);

console.log('Load balancer running on port 3000');
console.log('Test servers should be running on ports 3001 and 3002');

async function testLoadBalancer() {
    console.log('Starting load balancer test...');
    
    // Make sequential requests to better demonstrate round-robin
    for (let i = 0; i < 6; i++) {
        try {
            const response = await fetch('http://localhost:3000/api/test');
            const result = await response.text();
            console.log(`Request ${i + 1}:`, result);
            // Add a small delay between requests
            await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
            console.error(`Error during request ${i + 1}:`, error);
        }
    }
}

// Run the test
testLoadBalancer(); 