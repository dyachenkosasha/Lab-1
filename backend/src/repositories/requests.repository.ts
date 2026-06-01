const requests: any[] = [];

export default {
  getAll() {
    return requests;
  },

  getById(id: number) {
    return requests.find((r) => r.id === id);
  },

  add(request: any) {
    requests.push(request);
    return request;
  },

  update(id: number, data: any) {
    const index = requests.findIndex((r) => r.id === id);

    if (index === -1) {
      return null;
    }

    requests[index] = {
      ...requests[index],
      ...data
    };

    return requests[index];
  },

  delete(id: number) {
    const index = requests.findIndex((r) => r.id === id);

    if (index === -1) {
      return false;
    }

    requests.splice(index, 1);

    return true;
  }
};