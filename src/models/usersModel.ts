import { v4 as uuidv4 } from 'uuid';
import { User } from '../interface';

class UsersModel {
  private users: User[] = [];

  getAllUsers() {
    return new Promise((resolve) => {
      resolve(this.users);
    });
  }

  getUser(id: string) {
    return new Promise((resolve) => {
      const findedUser = this.users.find((user) => user.id === id);
      resolve(findedUser);
    });
  }

  addUser(newUser: User) {
    return new Promise((resolve) => {
      const id = uuidv4();
      const user = { ...newUser, id };
      this.users.push(user);
      resolve(user);
    });
  }
}

const userModel = new UsersModel();
export default userModel;
