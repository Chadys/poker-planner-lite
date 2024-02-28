export enum UserRoleEnum {
  Player,
  Observer,
}

export type UserModel = {
  name: string;
  role: UserRoleEnum;
};
