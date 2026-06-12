import commentsRepository from "../repositories/comments.repository";
import requestsRepository from "../repositories/requests.repository";

const commentsService = {
  async getByRequestId(requestId: number) {
    const request = await requestsRepository.getById(requestId);
    if (!request) {
      throw { status: 404, message: "Request not found" };
    }
    return commentsRepository.getByRequestId(requestId);
  },

  async create(requestId: number, userId: number, body: string) {
    const request = await requestsRepository.getById(requestId);
    if (!request) {
      throw { status: 404, message: "Request not found" };
    }
    return commentsRepository.create(requestId, userId, body);
  },

  async update(id: number, body: string) {
    const comment = await commentsRepository.getById(id);
    if (!comment) {
      throw { status: 404, message: "Comment not found" };
    }
    return commentsRepository.update(id, body);
  },

  async delete(id: number) {
    const deleted = await commentsRepository.delete(id);
    if (!deleted) {
      throw { status: 404, message: "Comment not found" };
    }
  },
};

export default commentsService;