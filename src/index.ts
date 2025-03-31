import express, { urlencoded } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import router from './routes';
import { handleErrors } from './middlewares/errorHandler';
import { loggingMiddleware } from './middlewares/logger';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './utils/swagger';

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: false }));
app.use(compression());
app.use(loggingMiddleware);
app.use(cookieParser());

// Routes
app.use('/api', router);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Handles non-existing routes & methods
app.all('*', (req, res) => {
  res.sendStatus(405);
});

// Error Handling Middleware
app.use(handleErrors);

app.listen(3000);
