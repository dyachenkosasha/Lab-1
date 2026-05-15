export interface CreateRequestDto {
  users: string;
  severity: number;
  status: string;
}

export function validateRequest(dto: CreateRequestDto) {
  const errors = [];

  if (!dto.users || dto.users.trim() === "") {
    errors.push({
      field: "users",
      message: "Users required"
    });
  }

  if (dto.severity < 1 || dto.severity > 5) {
    errors.push({
      field: "severity",
      message: "Severity must be 1-5"
    });
  }

  if (
    !["Open", "In progress", "Resolved"].includes(dto.status)
  ) {
    errors.push({
      field: "status",
      message: "Invalid status"
    });
  }

  return errors;
}