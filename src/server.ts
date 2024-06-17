import app from './app';
import config from './app/config';
import mongoose from 'mongoose';
import { Server } from 'http';

let server: Server;
async function main() {
  await mongoose.connect(config.databaseUri as string);

  server = app.listen(Number(config.port), () => {
    console.log(`Example app listening on port ${config.port}`);
  });
}

main().catch((err) => console.log(err));

process.on('unhandledRejection', () => {
  console.log('Unhandled Rejection is detected!!');
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on('uncaughtException', () => {
  console.log('Uncaught Exception is detected!!');
  process.exit(1);
});
