export const getHomeRoute = (roles: string[]) => {
  if (roles.includes("admin")) {
    return "/admin";
  }

  if (roles.includes("user")) {
    return "/app";
  }

  return "/";
};