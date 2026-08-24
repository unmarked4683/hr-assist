export type IUserEntity = {
  id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  accessToken?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ICreateUserDto = Omit<
  IUserEntity,
  'id' | 'createdAt' | 'updatedAt'
>;
