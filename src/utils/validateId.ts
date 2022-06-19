import { validate } from 'uuid';

const isValidId = (id: string) => validate(id);

export default isValidId;
