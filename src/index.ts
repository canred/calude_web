import 'dotenv/config';
import express from 'express';
import { router } from './routes';
import { errorHandler } from './middleware/error';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', router);
app.use(errorHandler);

export default app;
