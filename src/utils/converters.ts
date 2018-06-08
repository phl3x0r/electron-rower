export function convertKmphToTT500(kmph: number) {
  return 1800 / kmph;
}

export function tt500string(tt500: number) {
  return `${Math.floor(tt500 / 60)}:${Math.round(tt500 % 60)}`;
}
