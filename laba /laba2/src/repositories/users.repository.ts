const users: any[] = [];

export default {
  getAll() {
    return users;
  },

  getById(id: number) {
    return users.find((u) => u.id === id);
  },

  add(user: any) {
    users.push(user);
    return user;
  }
};