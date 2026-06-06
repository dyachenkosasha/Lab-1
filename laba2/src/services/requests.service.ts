import repository from "../repositories/requests.repository";

const requestsService = {
  getAll(params: {
    userId?: number;
    status?: string;
    sort?: string;
    order?: string;
    limit?: number;
  }) {
    return repository.getAll(params);
  },

  async getById(id: number) {
    const request = await repository.getById(id);
    if (!request) throw { status: 404, message: "Request not found" };
    return request;
  },

  getWithAuthors() {
    return repository.getWithAuthors();
  },

  getStatusCounts() {
    return repository.getStatusCounts();
  },

  searchByTitle(q: string) {
    return repository.searchByTitle(q);
  },
// передає виклик у репозиторій для отримання запитів за рівнем серйозності (severity) 
  getBySeverity(severity: number) {
    return repository.getBySeverity(severity);
  },

  create(userId: number, title: string, severity: number, status: string) {
    return repository.create(userId, title, severity, status);
  },

  async update(id: number, title: string, severity: number, status: string) {
    const request = await repository.update(id, title, severity, status);
    if (!request) throw { status: 404, message: "Request not found" };
    return request;
  },

  async delete(id: number) {
    const deleted = await repository.delete(id);
    if (!deleted) throw { status: 404, message: "Request not found" };
  },
};

export default requestsService;