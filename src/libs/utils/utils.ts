type EnumValueType<TEnum> = (TEnum[keyof TEnum] & number) | string;
export type EnumType<TEnum> = {
  [k: number]: string;
  [k: string]: EnumValueType<TEnum>;
};
export function enumArray<TEnum extends EnumType<TEnum>, K extends keyof TEnum>(
  obj: TEnum
): K[] {
  return Object.values(obj).filter(k => !Number.isNaN(Number(k))) as K[];
}
