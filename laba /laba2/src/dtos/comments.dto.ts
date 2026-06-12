export interface CreateCommentDto {
  userId: number;
  body: string;
}

export function validateCreateComment(dto: CreateCommentDto): string[] {
  const errors: string[] = [];

  if (!dto.userId || !Number.isFinite(Number(dto.userId))) {
    errors.push("userId must be a number");
  }
  if (!dto.body || dto.body.trim() === "") {
    errors.push("body is required");
  }

  return errors;
}

export function validateUpdateComment(dto: { body?: string }): string[] {
  const errors: string[] = [];
  if (!dto.body || dto.body.trim() === "") {
    errors.push("body is required");
  }
  return errors;
}