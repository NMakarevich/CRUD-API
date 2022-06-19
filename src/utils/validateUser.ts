const isValidUser = (newUser: any): boolean => {
  // 1st check: check for keys
  const requiredFields = ['username', 'age', 'hobbies'].sort();
  const userFields = Object.keys(newUser).sort();
  if (JSON.stringify(requiredFields) !== JSON.stringify(userFields)) {
    return false;
  }

  // 2nd check: check for types
  if (typeof newUser.username !== 'string') return false;
  if (typeof newUser.age !== 'number') return false;
  if (!Array.isArray(newUser.hobbies)) return false;

  // 3rd check: check types in array
  const { hobbies } = newUser;
  if (hobbies.length) {
    let isString = true;
    hobbies.forEach((hobby: unknown) => {
      if (typeof hobby !== 'string') isString = false;
    });
    if (!isString) return false;
  }

  return true;
};

export default isValidUser;
