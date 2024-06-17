export interface TUser {
  name: string;
  email: string;
  password: string; // Must be hashed
  phone: string;
  role: 'admin' | 'user';
  address: string;
}

export type TUserRole = 'admin' | 'user';
