import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { ThemeProvider } from "@/providers/theme-provider.jsx";
import { Toaster } from "../components/ui/sonner.jsx";

const RootLayout = () => {
  return (
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Outlet />
        <Toaster />
        {/* <TanStackRouterDevtools /> */}
      </ThemeProvider>
  );
};

export const Route = createRootRoute({ component: RootLayout });
