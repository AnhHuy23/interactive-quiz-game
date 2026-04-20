import { createApp } from './app';

const PORT = Number(process.env.PORT) || 8080;

const app = createApp();

app.listen(PORT, () => {
  console.log(`Quiz API listening on http://localhost:${PORT}`);
});
