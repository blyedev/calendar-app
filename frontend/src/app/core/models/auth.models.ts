export type Username = string;
export type Email = string;
export type Timestamp = number;

interface AccountConfiguration {
  authentication_method: 'email' | 'username' | 'username_email';
  is_open_for_signup: boolean;
  email_verification_by_code_enabled: boolean;
  login_by_code_enabled: boolean;
}

// Type incomplete if mfa, social login or usersessions module is ever enabled
export interface Configuration {
  account: AccountConfiguration;
}

interface UsernameEmailAuthenticationMethod {
  method: 'password';
  at: Timestamp;
  email?: Email;
  username?: Username;
}

interface PasswordReauthenticationMethod {
  method: 'password';
  at: Timestamp;
  reauthenticated: boolean;
}

type ProviderId = string;
type ProviderAccountId = string;

interface ThirdPartyAuthenticationMethod {
  method: 'socialaccount';
  at: Timestamp;
  provider: ProviderId;
  uid: ProviderAccountId;
}

interface TwoFactorReauthenticationMethod {
  method: 'mfa';
  at: Timestamp;
  type: 'recovery_codes' | 'totp';
  reauthenticated?: boolean;
}

export interface Authenticated {
  user: {
    id?: number | string;
    display?: string;
    has_usable_password?: boolean;
    email?: Email;
    username?: Username;
  };
  methods: (
    | UsernameEmailAuthenticationMethod
    | PasswordReauthenticationMethod
    | ThirdPartyAuthenticationMethod
    | TwoFactorReauthenticationMethod
  )[];
}

export interface AuthenticationMeta {
  session_token?: string;
  access_token?: string;
  is_authenticated: boolean;
}

export interface Flow {
  id:
    | 'verify_email'
    | 'login'
    | 'signup'
    | 'provider_redirect'
    | 'provider_signup'
    | 'provider_token'
    | 'mfa_authenticate'
    | 'reauthenticate'
    | 'mfa_reauthenticate';
  provider?: {
    id: string;
    name: string;
    client_id?: string;
    flows: ('provider_redirect' | 'provider_token')[];
  };
  is_pending?: true;
}

export interface InputError<T> {
  message: string;
  code: string | 'email_password_mismatch' | 'invalid';
  param?: string | T extends T ? keyof T : never;
}
