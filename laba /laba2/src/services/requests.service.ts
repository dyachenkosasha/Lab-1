import repository from "../repositories/requests.repository";

export default {
  getAll() {
    return repository.getAll();
  },

  getById(id: number) {
    const request = repository.getById(id);

    if (!request) {
      throw {
        status: 404,
        message: "Request not found"
      };
    }

    return request;
  },

  create(data: any) {
    const request = {
      id: Date.now(),
      ...data,
      createdAt: new Date().toISOString()
    };

    return repository.add(request);
  },

  update(id: number, data: any) {
    const request = repository.update(id, data);

    if (!request) {
      throw {
        status: 404,
        message: "Request not found"
      };
    }

    return request;
  },

  delete(id: number) {
    const deleted = repository.delete(id);

    if (!deleted) {
      throw {
        status: 404,
        message: "Request not found"
      };
    }
  }
};