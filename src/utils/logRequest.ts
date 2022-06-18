import http from 'http';
import * as os from 'os';

const logRequest = (req: http.IncomingMessage, statusCode: number) => {
  let coloredStatusCode = `\x1b[31m${statusCode}\x1b[0m`;
  if (Math.floor(statusCode / 100) === 2) {
    coloredStatusCode = `\x1b[32m${statusCode}\x1b[0m`;
  }
  if (Math.floor(statusCode / 100) === 4) {
    coloredStatusCode = `\x1b[33m${statusCode}\x1b[0m`;
  }
  process.stdout.write(
    `${req.method} ${req.url} ${coloredStatusCode}${os.EOL}`
  );
};

export default logRequest;
