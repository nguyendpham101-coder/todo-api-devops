const path = require('path');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const todoRoutes = require('./routes/todo.routes');

const app = express();

const swaggerDocument = YAML.load(path.join(__dirname, '..', 'swagger', 'openapi.yaml'));

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/todos', todoRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;