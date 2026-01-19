export const withBase = (value: string) => {
  if (!value.startsWith("/")) {
    return value;
  }
  if (import.meta.env.BASE_URL === "/") {
    return value;
  }
  return `${import.meta.env.BASE_URL}${value.slice(1)}`;
};

export const stripBase = (pathname: string) => {
  if (import.meta.env.BASE_URL === "/") {
    return pathname;
  }
  return pathname.startsWith(import.meta.env.BASE_URL)
    ? `/${pathname.slice(import.meta.env.BASE_URL.length)}`
    : pathname;
};
