import repository from "../repositories/users.repository";

export default {
  getAll() {
    return repository.getAll();
  },

  create(data: any) {
    const user = {
      id: Date.now(),
      ...data
    };

    return repository.add(user);
  }
};