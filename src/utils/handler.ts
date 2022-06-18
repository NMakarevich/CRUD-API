import http from 'http';
import { baseUrl, ErrorMessages, headers } from '../consts';
import UsersController from '../controller/usersController';
import isValidId from './validateId';
import isValidUser from './validateUser';
import response from './response';

class Handler {
  baseUrl = baseUrl;

  headers = headers;

  usersController = new UsersController();

  handleReq(req: http.IncomingMessage, res: http.ServerResponse) {
    const { method, url } = req;

    if (!url?.startsWith(this.baseUrl)) {
      response(req, res, 404, this.headers, {
        message: ErrorMessages.endpoint
      });
      return;
    }

    if (method === 'GET') {
      if (url === this.baseUrl) {
        this.usersController.getUsers(req, res).then(() => {});
      } else {
        const id = url?.split('/').pop();
        if (!id || !isValidId(id)) {
          response(req, res, 400, this.headers, {
            message: ErrorMessages.uuid
          });
        } else this.usersController.getUser(req, res, id).then(() => {});
      }
    }

    if (method === 'POST') {
      if (url !== this.baseUrl) {
        response(req, res, 404, this.headers, {
          message: ErrorMessages.endpoint
        });
      }
      let data = '';
      req.on('data', (chunk) => (data += chunk));
      req.on('error', (err) => {
        response(req, res, 500, this.headers, {
          message: `Error has been occurs. ${err.message}`
        });
      });
      req.on('end', () => {
        const user = JSON.parse(data);
        if (!isValidUser(user)) {
          response(req, res, 400, this.headers, {
            message: ErrorMessages.body
          });
        } else this.usersController.addUser(req, res, user).then(() => {});
      });
    }

    if (method === 'PUT') {
      const id = url?.split('/').pop();
      if (!id || !isValidId(id)) {
        response(req, res, 400, this.headers, { message: ErrorMessages.uuid });
      }

      let data = '';
      req.on('data', (chunk) => (data += chunk));
      req.on('error', (err) => {
        response(req, res, 500, this.headers, {
          message: `Error has been occurs. ${err.message}`
        });
      });
      req.on('end', () => {
        const user = JSON.parse(data);
        if (!isValidUser(user)) {
          response(req, res, 400, this.headers, {
            message: ErrorMessages.body
          });
        } else {
          this.usersController
            .updateUser(req, res, { ...user, id })
            .then(() => {});
        }
      });
    }

    if (method === 'DELETE') {
      const id = url?.split('/').pop();
      if (!id || !isValidId(id)) {
        response(req, res, 400, this.headers, { message: ErrorMessages.uuid });
      } else {
        this.usersController.deleteUser(req, res, id).then(() => {});
      }
    }
  }
}

export default Handler;
