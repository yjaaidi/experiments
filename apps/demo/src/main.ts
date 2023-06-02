import express from 'express';
import {getLocalesHandler} from '@demo/locale/graphql-feature';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.get('/', getLocalesHandler);

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
