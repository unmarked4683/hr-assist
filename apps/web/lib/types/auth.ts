export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface Session {
  token: string;
  user: User;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  session: Session;
}
