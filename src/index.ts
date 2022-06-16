import http from 'http';
import 'dotenv/config';
import * as os from 'os';
import Handler from './utils/handler';

class Server {
  PORT = process.env.SERVER_PORT || 5000;

  server!: http.Server;

  handler!: Handler;

  run() {
    this.server = http.createServer((req, res) => {
      this.handler = new Handler();
      this.handler.handleReq(req, res);
    });
    this.server.listen(this.PORT, () => {
      process.stdout.write(`Server is running on port ${this.PORT}${os.EOL}`);
    });
  }
}

const server = new Server();
server.run();
