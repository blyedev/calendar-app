import {
  Authenticated,
  AuthenticationMeta,
  Configuration,
  Email,
  Flow,
  InputError,
  Username,
} from './auth.models';

export interface ConfigurationResponse {
  status: 200;
  data: Configuration;
}

export interface AuthenticatedResponse {
  status: 200;
  data: Authenticated;
  meta: AuthenticationMeta;
}

export interface InputErrorResponse<T> {
  status: 400;
  errors: InputError<T>[];
}

export interface NotAuthenticatedResponse {
  status: 401;
  data: { flows: Flow[] };
  meta: AuthenticationMeta;
}

export interface ForbiddenResponse {
  status: 403;
}

export interface ConflictResponse {
  status: 409;
}

export interface SessionGoneResponse {
  status: 410;
  data: { flows: Flow[] };
  meta: AuthenticationMeta;
}

export type SessionResponse =
  | AuthenticatedResponse
  | NotAuthenticatedResponse
  | SessionGoneResponse;

export type LoginRequest = {
  password: string;
} & ({ username: Username } | { email: Email });

export type LoginResponse =
  | AuthenticatedResponse
  | InputErrorResponse<LoginRequest>
  | NotAuthenticatedResponse
  | ConflictResponse;

export interface SignupRequest {
  password: string;
  username: Username;
  email: Email;
}

export type SignupResponse =
  | AuthenticatedResponse
  | InputErrorResponse<SignupRequest>
  | NotAuthenticatedResponse
  | ForbiddenResponse
  | ConflictResponse;
