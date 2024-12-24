import {
  Authenticated,
  AuthenticationMeta,
  Configuration,
  Flow,
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

export interface NotAuthenticatedResponse {
  status: 401;
  data: { flows: Flow[] };
  meta: AuthenticationMeta;
}

export type SessionResponse = AuthenticatedResponse | NotAuthenticatedResponse;
