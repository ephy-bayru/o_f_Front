export interface IUser {
    _id: string;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    role: IUserRole;
    permissions: string[];
    suspended: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface IUserPayload extends Partial<IUser> {}
  
  export enum IUserRole {
    User = 'user',
    Admin = 'admin'
  }
  
  export interface IAuth {
    email: string;
    password: string;
  }
  
  export interface IAuthResponse {
    status: string;
    message: string;
    data: {
      user: IUser;
      accessToken: string;
      refreshToken: string;
    };
  }
  