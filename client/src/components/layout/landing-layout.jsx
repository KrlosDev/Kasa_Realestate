import { Link, useMatchRoute } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { FloatingShape } from "../ui/floating-shape";

export function LandingLayout({ children }) {
  const matchRoute = useMatchRoute();
  const isOnPricingPage = !!matchRoute({ to: "/pricing" });

  const logo = {
    url: "/",
    title: "KSA",
  };

  const menu = [
    { title: "Features", url: "/features" },
    { title: "Pricing", url: "/pricing" },
  ];

  const auth = {
    signin: { title: "Sign In", url: "/signin" },
    signup: { title: "Get Started", url: "/pricing" },
  };

  const renderMenuItem = (item) => {
    return (
      <NavigationMenuItem key={item.title}>
        <Button
          variant="ghost"
          asChild
          className="hover:bg-transparent dark:hover:bg-transparent"
        >
          <Link
            to={item.url}
            activeProps={{
              className:
                "text-foreground relative cursor-pointer transition-colors after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:origin-center after:transition-transform after:duration-300 after:ease-out after:scale-x-100",
            }}
            className="text-foreground relative cursor-pointer transition-colors after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:origin-center after:transition-transform after:duration-300 after:ease-out after:scale-x-0"
          >
            {item.title}
          </Link>
        </Button>
      </NavigationMenuItem>
    );
  };

  const renderMobileMenuItem = (item) => {
    return (
      <Link
        key={item.title}
        to={item.url}
        className="cursor-pointer text-foreground font-semibold"
        activeProps={{
          className: "text-primary",
        }}
      >
        {item.title}
      </Link>
    );
  };
  return (
    <div className="min-h-screen max-w-[100vw] w-full bg-background overflow-y-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {/* Sticky Navbar */}
      <section className="fixed top-0 left-0 right-0 z-50 border-b border-accent dark:border-none bg-background">
        <FloatingShape
          color="bg-green-500"
          size="w-24 h-24"
          top="-5%"
          left="10%"
          delay={0}
        />
        <FloatingShape
          color="bg-emerald-500"
          size="w-48 h-48"
          top="70%"
          left="80%"
          delay={5}
        />
        <FloatingShape
          color="bg-lime-500"
          size="w-32 h-32"
          top="800%"
          left="50%"
          delay={2}
        />
        <div className="container py-4">
          {/* Desktop Menu */}
          <nav className="hidden items-center justify-between lg:flex mx-10">
            <div className="flex items-center gap-6">
              {/* Logo */}
              <Link to={logo.url} className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight">
                  {logo.title}
                </span>
              </Link>
              <div className="flex items-center">
                <NavigationMenu>
                  <NavigationMenuList className="flex gap-4">
                    {menu.map((item) => renderMenuItem(item))}
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ModeToggle />
              <Button asChild>
                <Link to={auth.signin.url}>{auth.signin.title}</Link>
              </Button>
              {!isOnPricingPage && (
                <Button
                  asChild
                  variant="outline"
                  className="text-foreground border-gray-100"
                >
                  <Link to={auth.signup.url}>{auth.signup.title}</Link>
                </Button>
              )}
            </div>
          </nav>

          {/* Mobile Menu */}
          <div className="block lg:hidden">
            <div className="flex items-center justify-between mx-5">
              {/* Logo */}
              <Link to={logo.url} className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight">
                  {logo.title}
                </span>
              </Link>
              <div className="flex items-center gap-2">
                <ModeToggle />
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="size-4 text-foreground" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="overflow-y-auto py-10">
                    <div className="flex flex-col gap-6 p-4">
                      <div className="flex w-full flex-col gap-4">
                        {menu.map((item) => renderMobileMenuItem(item))}
                      </div>

                      <div className="flex flex-col gap-3">
                        <Button asChild variant="">
                          <Link to={auth.signin.url}>{auth.signin.title}</Link>
                        </Button>
                        {!isOnPricingPage && (
                          <Button
                            asChild
                            variant="outline"
                            className="text-foreground border-gray-100"
                          >
                            <Link to={auth.signup.url}>{auth.signup.title}</Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Page Content */}
      <div className="pt-18.5">{children}</div>
    </div>
  );
}
