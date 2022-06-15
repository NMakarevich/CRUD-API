const isValidNewUser = (newUser: any): boolean => {
  // 1st check: check for keys
  const requiredFields = ['username', 'age', 'hobbies'].sort();
  const newUserFields = Object.keys(newUser).sort();
  if (JSON.stringify(requiredFields) !== JSON.stringify(newUserFields)) {
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
    hobbies.forEach((hobbie: unknown) => {
      if (typeof hobbie !== 'string') isString = false;
    });
    if (!isString) return false;
  }

  return true;
};

export default isValidNewUser;
