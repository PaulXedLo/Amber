export default defineNuxtRouteMiddleware((to, from) => {
  const user = useUserStore();

  if (!user.isSignedIn && to.path !== "/auth") {
    return navigateTo("/auth");
  }

  if (user.isSignedIn && to.path === "/auth") {
    return navigateTo("/home");
  }

  if (!user.isSignedIn && to.path === "/profile/myprofile") {
    return navigateTo("/auth");
  }
});
