import http from 'http';
import userModel from '../models/usersModel';
import { User } from '../interface';

class UsersController {
  usersModel = userModel;

  getUsers = async (
    req: http.IncomingMessage,
    res: http.ServerResponse
  ): Promise<void> => {
    try {
      const users = await this.usersModel.getAllUsers();
      res.writeHead(200, { 'Content-Type': 'appliction/json' });
      res.end(JSON.stringify(users));
    } catch (err) {
      console.log(err);
    }
  };

  getUser = async (
    req: http.IncomingMessage,
    res: http.ServerResponse,
    id: string
  ) => {
    try {
      const user = await this.usersModel.getUser(id);
      if (user) {
        res.writeHead(200, { 'Content-Type': 'appliction/json' });
        res.end(JSON.stringify(user));
      } else {
        res.writeHead(404, { 'Content-Type': 'appliction/json' });
        res.end(JSON.stringify({ message: 'User is not found' }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  addUser = async (
    req: http.IncomingMessage,
    res: http.ServerResponse,
    user: User
  ) => {
    const newUser = await this.usersModel.addUser(user);
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(newUser));
  };
}

export default UsersController;
