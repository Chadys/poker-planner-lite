import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function forbiddenValuesValidator(
  forbiddenValues: string[]
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = forbiddenValues.includes(control.value);
    console.debug(control.value);
    console.debug(forbiddenValues);
    console.debug(forbidden);
    return forbidden ? { forbiddenValue: { value: control.value } } : null;
  };
}
