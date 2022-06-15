import http from 'http';
import baseUrl from '../consts';
import UsersController from '../controller/usersController';
import isValidId from './validateId';
import isValidNewUser from './validateNewUser';

class Handler {
  baseUrl = baseUrl;

  usersController = new UsersController();

  handleReq(req: http.IncomingMessage, res: http.ServerResponse) {
    const { method, url } = req;

    if (!url?.startsWith(this.baseUrl)) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid endpoint' }));
      return;
    }

    if (method === 'GET') {
      if (url === this.baseUrl) {
        this.usersController.getUsers(req, res).then(() => {});
      } else {
        const id = url?.split('/').pop();
        if (!id || !isValidId(id)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Invalid uuid' }));
        } else this.usersController.getUser(req, res, id).then(() => {});
      }
    }

    if (method === 'POST') {
      let data = '';
      req.on('data', (chunk) => (data += chunk));
      req.on('end', () => {
        const user = JSON.parse(data);
        if (!isValidNewUser(user)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              message:
                'Invalid body. Body must contains next fields: username - string, age - number, hobbies - string array'
            })
          );
        } else this.usersController.addUser(req, res, user);
      });
    }
  }
}

export default Handler;
