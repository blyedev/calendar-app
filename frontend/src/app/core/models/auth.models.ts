export interface AuthPingResponse {
  is_authenticated: boolean;
}

export interface AuthResponse {
  expiry: string;
  token: string;
}

export interface Credentials {
  username: string;
  password: string;
}
