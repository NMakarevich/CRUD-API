import http from 'http';
import userModel from '../models/usersModel';
import { User } from '../interfaces';
import { headers, ErrorMessages } from '../consts';
import response from '../utils/response';
import logRequest from '../utils/logRequest';

class UsersController {
  usersModel = userModel;

  headers = headers;

  getUsers = async (req: http.IncomingMessage, res: http.ServerResponse) => {
    try {
      const users = await this.usersModel.getAllUsers();
      response(req, res, 200, this.headers, users);
    } catch (err) {
      response(req, res, 500, this.headers, {
        message: 'Error has been occurs during get users',
      });
    }
  };

  getUser = async (
    req: http.IncomingMessage,
    res: http.ServerResponse,
    id: string,
  ) => {
    try {
      const user = (await this.usersModel.getUser(id)) as User;
      if (user) {
        response(req, res, 200, this.headers, user);
      } else {
        response(req, res, 404, this.headers, {
          message: ErrorMessages.notFound,
        });
      }
    } catch (err) {
      response(req, res, 500, this.headers, {
        message: 'Error has been occurs during get user',
      });
    }
  };

  addUser = async (
    req: http.IncomingMessage,
    res: http.ServerResponse,
    user: User,
  ) => {
    const newUser = (await this.usersModel.addUser(user)) as User;
    response(req, res, 201, this.headers, newUser);
  };

  updateUser = async (
    req: http.IncomingMessage,
    res: http.ServerResponse,
    user: User,
  ) => {
    const updatedUser = (await this.usersModel.updateUser(user)) as User;
    if (!updatedUser) {
      response(req, res, 404, this.headers, {
        message: ErrorMessages.notFound,
      });
    } else {
      response(req, res, 200, this.headers, updatedUser);
    }
  };

  deleteUser = async (
    req: http.IncomingMessage,
    res: http.ServerResponse,
    id: string,
  ) => {
    const statusCode = await this.usersModel.deleteUser(id);
    if (statusCode === 404) {
      response(req, res, 404, this.headers, {
        message: ErrorMessages.notFound,
      });
    }
    if (statusCode === 204) {
      res.writeHead(204);
      res.end();
      logRequest(req, 204);
    }
  };
}

export default UsersController;
