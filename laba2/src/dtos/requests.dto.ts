export interface CreateRequestDto {
  userId: number;
  title: string;
  severity: number;
  status: string;
}

export interface UpdateRequestDto {
  title: string;
  severity: number;
  status: string;
}

const VALID_STATUSES = ["Open", "In progress", "Resolved"];

export function validateCreateRequest(dto: CreateRequestDto): string[] {
  const errors: string[] = [];

  if (!dto.userId || !Number.isFinite(Number(dto.userId))) {
    errors.push("userId must be a number");
  }
  if (!dto.title || dto.title.trim() === "") {
    errors.push("title is required");
  }
  if (!Number.isFinite(Number(dto.severity)) || dto.severity < 1 || dto.severity > 5) {
    errors.push("severity must be between 1 and 5");
  }
  if (!VALID_STATUSES.includes(dto.status)) {
    errors.push(`status must be one of: ${VALID_STATUSES.join(", ")}`);
  }

  return errors;
}

export function validateUpdateRequest(dto: UpdateRequestDto): string[] {
  const errors: string[] = [];

  if (!dto.title || dto.title.trim() === "") {
    errors.push("title is required");
  }
  if (!Number.isFinite(Number(dto.severity)) || dto.severity < 1 || dto.severity > 5) {
    errors.push("severity must be between 1 and 5");
  }
  if (!VALID_STATUSES.includes(dto.status)) {
    errors.push(`status must be one of: ${VALID_STATUSES.join(", ")}`);
  }

  return errors;
}