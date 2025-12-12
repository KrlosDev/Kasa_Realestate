import { Moon, Sun, Monitor } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/providers/theme-provider"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark")
    } else {
      setTheme("light")
    }
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      <div className="relative flex items-center justify-center w-[1.2rem] h-[1.2rem]">
        <Sun className={`absolute h-[1.2rem] w-[1.2rem] text-foreground transition-all duration-300 ${
          theme === "light" 
            ? "rotate-0 scale-100 opacity-100" 
            : "-rotate-90 scale-0 opacity-0"
        }`} />
        <Moon className={`absolute h-[1.2rem] w-[1.2rem] text-foreground transition-all duration-300 ${
          theme === "dark" 
            ? "rotate-0 scale-100 opacity-100" 
            : "rotate-90 scale-0 opacity-0"
        }`} />
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}