export interface SignUpParams {
  username: string;
  password: string;
  email: string;
}

export interface SignInParams {
  username: string;
  password: string;
}

export interface AccesTokenResponse {
  access_token: string;
}
