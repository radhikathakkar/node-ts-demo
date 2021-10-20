export type FailResponse = {
  message: string;
};

export type SuccessResponse = {
  token?: string;
  result?: any;
  message: string;
};

// export type SuccessResponse<T> = T;
export type ServiceResponse<T> =
  | { error: string; data: null; status: false; statusCode: number }
  | { error: null; data: SuccessResponse; status: true; statusCode: number };

export type TokenResponse<T> = T;
export type TokenDataResponse<T> =
  | { error: string; data: null }
  | { error: null; data: TokenResponse<T> };
