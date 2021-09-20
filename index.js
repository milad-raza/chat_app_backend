const winston = require('winston');
const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();

const port = process.env.PORT || 3000
app.listen(port, () => winston.info(`listing on port ${port}...`))