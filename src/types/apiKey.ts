export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
}

export interface ApiKeyCreateResponse {
  id: string;
  name: string;
  prefix: string;
  secretKey: string;
  createdAt: string;
}
