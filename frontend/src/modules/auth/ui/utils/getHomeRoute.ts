export const getHomeRoute = (roles: string[]) => {
  if (roles.includes("admin") || roles.includes("ROLE_ADMIN")) {
    return "/admin";
  }

  if (roles.includes("user") || roles.includes("ROLE_USER")) {
    return "/app";
  }

  return "/";
};