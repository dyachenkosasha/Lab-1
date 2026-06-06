export interface RequestDto {
  id: number;
  userId: number;
  title: string;
  severity: number;
  status: string;
  createdAt: string;
}

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

export interface ApiError {
  status: number;
  message: string;
  details?: string;
}