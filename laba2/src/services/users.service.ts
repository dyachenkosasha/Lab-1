import repository from "../repositories/users.repository";

const usersService = {
  getAll() {
    return repository.getAll();
  },

  async getById(id: number) {
    const user = await repository.getById(id);
    if (!user) throw { status: 404, message: "User not found" };
    return user;
  },

  create(email: string, name: string) {
    return repository.create(email, name);
  },

  async update(id: number, name: string) {
    const user = await repository.update(id, name);
    if (!user) throw { status: 404, message: "User not found" };
    return user;
  },

  async delete(id: number) {
    const deleted = await repository.delete(id);
    if (!deleted) throw { status: 404, message: "User not found" };
  },
//передає виклик до репозиторію для отримання топ 7 коментаторів
  getTopCommenters() {
    return repository.getTopCommenters();
  },
};

export default usersService;