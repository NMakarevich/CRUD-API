import { v4 as uuidv4 } from 'uuid';
import { User } from '../interfaces';

class UsersModel {
  private users: User[] = [];

  getAllUsers(): Promise<User[]> {
    return new Promise((resolve) => {
      resolve(this.users);
    });
  }

  getUser(id: string): Promise<User | undefined> {
    return new Promise((resolve) => {
      const foundUser = this.users.find((user) => user.id === id);
      resolve(foundUser);
    });
  }

  addUser(newUser: User): Promise<User> {
    return new Promise((resolve) => {
      const id = uuidv4();
      const user = { ...newUser, id };
      this.users.push(user);
      resolve(user);
    });
  }

  updateUser(user: User): Promise<User | null> {
    return new Promise((resolve) => {
      const userToUpdate = this.users.find(
        (userInBd) => userInBd.id === user.id
      );
      if (!userToUpdate) resolve(null);
      else {
        const userIdx = this.users.findIndex(
          (userInBd) => userInBd.id === user.id
        );
        this.users[userIdx] = user;
        resolve(user);
      }
    });
  }

  deleteUser(id: string): Promise<number> {
    return new Promise((resolve) => {
      const userIdx = this.users.findIndex((user) => user.id === id);
      if (userIdx === -1) {
        resolve(404);
      } else {
        this.users = [
          ...this.users.slice(0, userIdx),
          ...this.users.slice(userIdx + 1)
        ];
        resolve(204);
      }
    });
  }
}

const userModel = new UsersModel();
export default userModel;
