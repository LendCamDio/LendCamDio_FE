export interface JwtPayload {
  sub: string;
  email: string;
  AvatarUrl: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
  IsVerified: string;
  jti: string;
  exp: number;
  iss: string;
  aud: string;
}

export interface User {
  id: string;
  email: string;
  role: string;
}

export interface AuthContextType {
  token: string | null;
  user: User | null;
  role: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, rememberMe: boolean) => Promise<void>;
  logout: () => void;
}

export type PaginationProps = {
  pageCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (event: { selected: number }) => void;
};

export * from "./entity.type";
