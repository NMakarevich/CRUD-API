import http from 'http';
import { ErrorMessage, User } from '../interfaces';
import logRequest from './logRequest';

const response = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  statusCode: number,
  headers: Record<string, string>,
  result: User | User[] | ErrorMessage,
) => {
  res.writeHead(statusCode, headers);
  res.end(JSON.stringify(result));
  logRequest(req, statusCode);
};

export default response;
