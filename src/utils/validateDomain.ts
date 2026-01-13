const DOMAIN_REGEX = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/;
const MAX_DOMAIN_LENGTH = 253;

export const validateDomain = (
  value: string,
): { success: true; data: string } | { success: false; error: string } => {
  if (!value || typeof value !== "string") {
    return { success: false, error: "도메인을 입력하세요" };
  }

  const trimmed = value.trim().toLowerCase();

  if (!trimmed) {
    return { success: false, error: "도메인을 입력하세요" };
  }

  if (trimmed.length > MAX_DOMAIN_LENGTH) {
    return { success: false, error: `도메인은 ${MAX_DOMAIN_LENGTH}자를 초과할 수 없습니다` };
  }

  if (!DOMAIN_REGEX.test(trimmed)) {
    return { success: false, error: "올바른 도메인 형식이 아닙니다 (예: example.com)" };
  }

  return { success: true, data: trimmed };
};
