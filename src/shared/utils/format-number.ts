/** 정수·실수를 천 단위 콤마 문자열로 변환합니다. (예: 10000 → "10,000") */
export const formatNumberWithCommas = (value: number): string => {
  if (!Number.isFinite(value)) return '0';
  return value.toLocaleString('ko-KR');
};
