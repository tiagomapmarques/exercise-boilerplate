import fastifyCompress from '@fastify/compress';
import fastifyStatic from '@fastify/static';
import fastify from 'fastify';

const server = fastify({
  logger: true,
});

// Serve all files compressed
server.register(fastifyCompress, {
  encodings: ['gzip', 'identity'],
});

// Serve all static files
server.register(fastifyStatic, {
  root: `${import.meta.dirname}/dist`,
});

// Serve all other routes as the base route
server.setNotFoundHandler((_, reply) => reply.sendFile('/'));

// Run the server
await server.listen({
  host: '0.0.0.0',
  port: 8080,
});
