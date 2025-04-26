export default defineNuxtRouteMiddleware((to) => {
  const user = useUserStore();
  if (!user.isSignedIn && to.path !== "/auth") {
    return navigateTo("/auth");
  }
  if (user.isSignedIn && to.path === "/auth") {
    return navigateTo("/home");
  }
});
