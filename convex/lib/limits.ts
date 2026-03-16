export const MAX_TITLE_LENGTH = 200;
export const MAX_SEGMENT_TEXT_LENGTH = 10_000;
export const MAX_TRANSLATION_LENGTH = 20_000;
export const MAX_USER_NAME_LENGTH = 200;
export const MAX_EMAIL_LENGTH = 320;

export function assertMaxLength(
  fieldName: string,
  value: string | undefined,
  maxLength: number
) {
  if (value && value.length > maxLength) {
    throw new Error(`${fieldName} must be ${maxLength} characters or fewer.`);
  }
}
