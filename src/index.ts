import express from 'express';

async function startApp() {
  const app = express();
  app.listen(3333, () => {
    console.log(`Server running on port ${3333}.`);
  });
}

startApp();
