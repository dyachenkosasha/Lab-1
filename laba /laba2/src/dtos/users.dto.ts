export interface CreateUserDto {
  name: string;
  email: string;
}

export function validateUser(dto: CreateUserDto) {
  const errors = [];

  if (!dto.name || dto.name.trim() === "") {
    errors.push({
      field: "name",
      message: "Name required"
    });
  }

  if (!dto.email || !dto.email.includes("@")) {
    errors.push({
      field: "email",
      message: "Invalid email"
    });
  }

  return errors;
}