export enum Role {
  Customer = 'user_customer',
  Admin = 'admin',
}

export enum Permission {
  Admin = 'admin',
}

export interface CreateUserData {
  email: string;
  name: string;
  lastName: string;
  password: string;
}
