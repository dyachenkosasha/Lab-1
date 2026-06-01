export interface CreateUserDto {
  name: string;
  email: string;
}

export interface UpdateUserDto {
  name: string;
}

export function validateCreateUser(dto: CreateUserDto): string[] {
  const errors: string[] = [];

  if (!dto.name || dto.name.trim() === "") {
    errors.push("name is required");
  }
  if (!dto.email || !dto.email.includes("@")) {
    errors.push("email must be a valid email address");
  }

  return errors;
}

export function validateUpdateUser(dto: UpdateUserDto): string[] {
  const errors: string[] = [];

  if (!dto.name || dto.name.trim() === "") {
    errors.push("name is required");
  }

  return errors;
}