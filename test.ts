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
    
    // Make multiple concurrent requests
    const requests = [
        fetch('http://localhost:3000/api/test'),
        fetch('http://localhost:3000/api/test'),
        fetch('http://localhost:3000/api/test')
    ];
    
    try {
        const responses = await Promise.all(requests);
        const results = await Promise.all(responses.map(r => r.text()));
        console.log('All responses received:');
        results.forEach((result, index) => {
            console.log(`Request ${index + 1}:`, result);
        });
    } catch (error) {
        console.error('Error during test:', error);
    }
}

// Run the test
testLoadBalancer(); 