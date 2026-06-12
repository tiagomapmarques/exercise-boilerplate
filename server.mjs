import fastifyCompress from '@fastify/compress';
import fastifyHelmet from '@fastify/helmet';
import fastifyStatic from '@fastify/static';
import fastify from 'fastify';

const server = fastify({
  logger: { level: 'warn' },
});

// Set security headers
server.register(fastifyHelmet);

// Serve all files compressed
server.register(fastifyCompress, {
  encodings: ['br', 'gzip', 'identity'],
});

// Serve all static files
server.register(fastifyStatic, {
  root: `${import.meta.dirname}/dist`,
});

// Standard path for liveness/readiness probes
const healthStatusCode = 200;
server.get('/health', (_, reply) => {
  reply.code(healthStatusCode).send();
});

// Serve all other routes as the base route
server.setNotFoundHandler((_, reply) => reply.sendFile('index.html'));

// Drain in-flight requests on shutdown signals
const shutdown = async () => {
  await server.close();
  process.exit(0);
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Run the server
try {
  await server.listen({
    host: '0.0.0.0',
    port: 8080,
  });
} catch (error) {
  server.log.error(error);
  process.exit(1);
}
