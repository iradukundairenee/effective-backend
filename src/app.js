import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import userAgent from 'express-useragent';
import router from './modules';
import swaggerDefinition from './utils/swagger';

const app = express();
const swaggerDoc = swaggerJsdoc(swaggerDefinition);

app.use(cors({ origin: true }));
app.set('trust proxy', true);
app.use(helmet());
app.use(morgan('dev'));
app.use(userAgent.express());

app.use(
  bodyParser.urlencoded({
    extended: false,
    limit: '50mb',
    parameterLimit: 500,
  }),
);
app.use(bodyParser.json({ limit: '50mb' }));
app.use('/assets', express.static('assets'));
app.use('/api/v1', router);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

export default app;
