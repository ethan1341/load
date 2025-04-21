# Load Balancer

A simple load balancer implementation in TypeScript that supports different load balancing strategies.

## Features

- Multiple load balancing strategies (Round Robin, Least Connections, etc.)
- Health checking for backend servers
- Configurable server weights
- TypeScript support

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the test servers:
```bash
npx ts-node testServer.ts 3001 1  # Server 1
npx ts-node testServer.ts 3002 2  # Server 2
```

3. Start the load balancer:
```bash
npx ts-node test.ts
```

## Testing

The project includes a test file that demonstrates the load balancer's functionality. Run the test with:

```bash
npx ts-node test.ts
```

## Configuration

The load balancer can be configured with different strategies and server configurations in the `LoadBalancer.ts` file.

## License

Private - All rights reserved 