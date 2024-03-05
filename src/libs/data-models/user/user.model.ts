import { enumArray } from '@poker/utils';

export enum UserRoleEnum {
  Player,
  Observer,
}
export const UserRoleEnumChoices = enumArray(UserRoleEnum);

export type UserModel = {
  name: string;
  role: UserRoleEnum;
};
