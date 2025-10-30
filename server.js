const fastify = require('fastify')({
  logger: true
});

// EJS Template Engine registrieren
fastify.register(require('point-of-view'), {
  engine: {
    ejs: require('ejs')
  },
  root: './views',
  viewExt: 'ejs'
});

// Statische Dateien aus public/ bereitstellen
fastify.register(require('@fastify/static'), {
  root: require('path').join(__dirname, 'public'),
  prefix: '/public/'
});

// Routen definieren
fastify.get('/', async (request, reply) => {
  return reply.view('pages/index');
});

fastify.get('/about', async (request, reply) => {
  return reply.view('pages/about');
});

// Server starten
const start = async () => {
  try {
    await fastify.listen({ port: 8080, host: '0.0.0.0' });
    console.log('🚀 Fastify Server läuft auf http://localhost:8080');
    console.log('📊 Server-Status: Bereit für Verbindungen');
    console.log('🎯 Drücke Strg+C zum Beenden');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
