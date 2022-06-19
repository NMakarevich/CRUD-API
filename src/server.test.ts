import request from 'supertest';
import server from './server';
import { User } from './interfaces';
import { ErrorMessages } from './consts';

const baseUrl = '/api/users';

let user: User = {
  username: 'Vasya',
  age: 27,
  hobbies: ['nodejs', 'angular'],
};

const secondUser: User = {
  username: 'Vova',
  age: 30,
  hobbies: ['games', 'movies'],
};

describe('Testing CRUD API', () => {
  describe('Scenario 1', () => {
    let id = '';
    let secondId = '';
    it('Should return empty array of users', async () => {
      const { body, statusCode } = await request(server).get(baseUrl);
      expect(statusCode).toEqual(200);
      expect(body).toEqual([]);
    });
    it('Should create user', async () => {
      const { body, statusCode } = await request(server)
        .post(baseUrl)
        .send(user);
      expect(statusCode).toEqual(201);
      expect(body.username).toEqual(user.username);
      expect(body.age).toEqual(user.age);
      expect(JSON.stringify(body.hobbies)).toEqual(
        JSON.stringify(user.hobbies),
      );
      id = body.id;
    });
    it('Should get user by id', async () => {
      const { body, statusCode } = await request(server).get(
        `${baseUrl}/${id}`,
      );
      expect(statusCode).toEqual(200);
      expect(JSON.stringify(body)).toEqual(JSON.stringify({ ...user, id }));
    });
    it('Should update user by id', async () => {
      user = { ...user, hobbies: [...user.hobbies, 'testing'] };
      const { body, statusCode } = await request(server)
        .put(`${baseUrl}/${id}`)
        .send(user);
      expect(statusCode).toEqual(200);
      expect(body.username).toEqual(user.username);
      expect(body.age).toEqual(user.age);
      expect(JSON.stringify(body.hobbies)).toEqual(
        JSON.stringify(user.hobbies),
      );
      expect(body.id).toEqual(id);
    });
    it('Should create second user', async () => {
      const response = await request(server).post(baseUrl).send(secondUser);
      secondId = response.body.id;
      const { body, statusCode } = await request(server).get(baseUrl);
      expect(statusCode).toEqual(200);
      expect(body.length).toEqual(2);
      const [user1, user2] = body;
      delete user1.id;
      delete user2.id;
      expect(JSON.stringify(user1)).toEqual(JSON.stringify(user));
      expect(JSON.stringify(user2)).toEqual(JSON.stringify(secondUser));
    });
    it('Should delete first user', async () => {
      const { statusCode } = await request(server).delete(`${baseUrl}/${id}`);
      expect(statusCode).toEqual(204);
      const { body } = await request(server).get(baseUrl);
      expect(JSON.stringify(body)).toEqual(
        JSON.stringify([{ ...secondUser, id: secondId }]),
      );
    });
  });
  describe('Scenario 2', () => {
    let id = '';
    it(`Should return message "${ErrorMessages.endpoint}"`, async () => {
      const { body, statusCode } = await request(server).get('/invalid_url');
      expect(statusCode).toEqual(404);
      expect(body.message).toEqual(ErrorMessages.endpoint);
    });
    it('Should return message about invalid body', async () => {
      const { body, statusCode } = await request(server)
        .post(baseUrl)
        .send({ ...user, hobbies: null });
      expect(statusCode).toEqual(400);
      expect(body.message).toEqual(ErrorMessages.body);
    });
    it(`Should return message "${ErrorMessages.uuid}"`, async () => {
      const { body, statusCode } = await request(server).get(
        `${baseUrl}/invalid_uuid`,
      );
      expect(statusCode).toEqual(400);
      expect(body.message).toEqual(ErrorMessages.uuid);
    });
    it(`Should return message "${ErrorMessages.notFound}"`, async () => {
      const res = await request(server).post(baseUrl).send(user);
      id = res.body.id;
      await request(server).delete(`${baseUrl}/${id}`);
      const { body, statusCode } = await request(server).get(
        `${baseUrl}/${id}`,
      );
      expect(statusCode).toEqual(404);
      expect(body.message).toEqual(ErrorMessages.notFound);
    });
  });
  describe('Scenario 3', () => {
    let id = '';
    // At now one user in users array;
    it('Should return 3 users', async () => {
      const promises = [];
      for (let i = 0; i < 2; i += 1) {
        promises.push(
          request(server)
            .post(baseUrl)
            .send({ ...user, age: user.age + i }),
        );
      }
      await Promise.all(promises);
      const { body } = await request(server).get(baseUrl);
      expect(body.length).toEqual(3);
      id = body[1].id;
    });
    it('Should get updated user with selected id', async () => {
      const response = await request(server).get(`${baseUrl}/${id}`);
      const updatedUser = { ...response.body, hobbies: [] };
      delete updatedUser.id;
      const { body, statusCode } = await request(server)
        .put(`${baseUrl}/${id}`)
        .send(updatedUser);
      expect(statusCode).toEqual(200);
      expect(JSON.stringify(body)).toEqual(
        JSON.stringify({ ...updatedUser, id }),
      );
    });
    it('Should return "User is not found"', async () => {
      await request(server).delete(`${baseUrl}/${id}`);
      const { body, statusCode } = await request(server).get(
        `${baseUrl}/${id}`,
      );
      expect(statusCode).toEqual(404);
      expect(body.message).toEqual(ErrorMessages.notFound);
    });
  });
  afterAll(() => {
    server.close();
  });
});
