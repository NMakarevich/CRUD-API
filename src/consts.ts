export const baseUrl = '/api/users';
export const headers = { 'Content-Type': 'application/json' };

export enum ErrorMessages {
  notFound = 'User is not found',
  endpoint = 'Invalid endpoint',
  uuid = 'Invalid uuid',
  body = 'Invalid body. Body must contains next fields: username - string, age - number, hobbies - string array',
}
