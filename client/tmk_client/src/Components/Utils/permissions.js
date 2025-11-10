export const hasPermission = (user, permissionName) => {
  if (!user || !user.permissions || !Array.isArray(user.permissions)) return false;

  return user.permissions.some(p => p.name === permissionName);
};