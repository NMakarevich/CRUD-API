import http from 'http';
import 'dotenv/config';
import * as os from 'os';
import Handler from './utils/handler';

const PORT = process.env.SERVER_PORT || 5000;

const server = http.createServer((req, res) => {
  const handler = new Handler();
  handler.handleReq(req, res);
});

server.listen(PORT, () => {
  process.stdout.write(
    `Server is running on port ${PORT}. PID: ${process.pid}${os.EOL}`,
  );
});

export default server;
