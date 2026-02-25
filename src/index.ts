import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { router } from './routes';
import { errorHandler } from './middleware/error';
import { apiLimiter, authLimiter } from './middleware/rateLimit';
import { swaggerSpec } from './swagger';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan(process.env['NODE_ENV'] === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter);
app.use('/api', router);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
