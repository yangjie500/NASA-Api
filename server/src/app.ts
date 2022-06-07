import express from 'express';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';

import { api } from './routes/api';

const app = express();

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use(morgan('combined'));


app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/v1', api);
// Can easily create another /v2 route here eg.
// app.use('/v2', apiV2);

// Try to use path module to find the static files
app.get('/*', (req, res: express.Response) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})

export default app;

