import express from 'express';
import bodyParser from 'body-parser';
import { initDb } from './db/connect.js';
import dotenv from 'dotenv';
import allRoutes from './routes/index.js';
import swaggerUi from 'swagger-ui-express';

import { readFileSync } from 'fs';
const loadJSON = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url)));
const swaggerDocument = loadJSON('./swagger.json');

dotenv.config();
// eslint-disable-next-line no-undef
const port = process.env.PORT || 3000;
const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
  })
  .use('/', allRoutes);

initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port);
    console.log(`Connected to DB and listening on ${port} | http://localhost:${port}/`);
  }
});
