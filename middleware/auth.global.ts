export default defineNuxtRouteMiddleware((to, from) => {
  const user = useUserStore();
  const publicPaths = ["/auth"];

  const isPublicPath =
    publicPaths.includes(to.path) ||
    (to.path.startsWith("/profile/") &&
      !to.path.startsWith("/profile/me") &&
      !to.path.startsWith("/profile/settings"));

  if (user.isSignedIn && to.path === "/auth") {
    return navigateTo("/home");
  }

  if (!user.isSignedIn && !isPublicPath) {
    return navigateTo("/auth");
  }
});
