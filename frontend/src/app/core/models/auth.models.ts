export interface AuthPingResponse {
  readonly is_authenticated: boolean;
}

export interface AuthResponse {
  readonly expiry: string;
  readonly token: string;
}

export interface Credentials {
  readonly username: string;
  readonly password: string;
}
