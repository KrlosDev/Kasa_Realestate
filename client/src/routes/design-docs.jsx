import { createFileRoute } from '@tanstack/react-router'
import { ModeToggle } from '@/components/ui/mode-toggle'

export const Route = createFileRoute('/design-docs')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-foreground">Color Palette</h1>
          <ModeToggle />
        </div>

        <div className="space-y-8">
          {/* Background Colors */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Background Colors</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ColorCard 
                name="Background" 
                className="bg-background border-2 border-border"
                textClass="text-foreground"
              />
              <ColorCard 
                name="Card" 
                className="bg-card border-2 border-border"
                textClass="text-card-foreground"
              />
              <ColorCard 
                name="Popover" 
                className="bg-popover border-2 border-border"
                textClass="text-popover-foreground"
              />
            </div>
          </section>

          {/* Primary Colors */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Primary Colors</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ColorCard 
                name="Primary" 
                className="bg-primary"
                textClass="text-primary-foreground"
              />
              <ColorCard 
                name="Secondary" 
                className="bg-secondary"
                textClass="text-secondary-foreground"
              />
              <ColorCard 
                name="Accent" 
                className="bg-accent"
                textClass="text-accent-foreground"
              />
            </div>
          </section>

          {/* Status Colors */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Status Colors</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ColorCard 
                name="Destructive" 
                className="bg-destructive"
                textClass="text-destructive-foreground"
              />
              <ColorCard 
                name="Muted" 
                className="bg-muted"
                textClass="text-muted-foreground"
              />
              <ColorCard 
                name="Border" 
                className="bg-background border-4 border-border"
                textClass="text-foreground"
                description="Border color"
              />
            </div>
          </section>

          {/* Text Colors */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Text Colors</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 bg-card border border-border rounded-lg">
                <p className="text-foreground font-medium mb-2">Foreground</p>
                <p className="text-foreground">Main text color</p>
              </div>
              <div className="p-6 bg-card border border-border rounded-lg">
                <p className="text-muted-foreground font-medium mb-2">Muted Foreground</p>
                <p className="text-muted-foreground">Secondary text color</p>
              </div>
              <div className="p-6 bg-card border border-border rounded-lg">
                <p className="text-foreground font-medium mb-2">Ring</p>
                <div className="mt-2 p-4 bg-background rounded ring-2 ring-ring ring-offset-2 ring-offset-background text-foreground">
                  Focus ring example
                </div>
              </div>
            </div>
          </section>

          {/* Interactive Elements */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Interactive Elements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-card border border-border rounded-lg space-y-3">
                <h3 className="font-semibold text-foreground">Buttons</h3>
                <div className="flex gap-2 flex-wrap">
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                    Primary
                  </button>
                  <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80">
                    Secondary
                  </button>
                  <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90">
                    Destructive
                  </button>
                </div>
              </div>
              <div className="p-6 bg-card border border-border rounded-lg space-y-3">
                <h3 className="font-semibold text-foreground">Input</h3>
                <input 
                  type="text" 
                  placeholder="Type something..."
                  className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function ColorCard({ name, className, textClass, description }) {
  return (
    <div className={`p-6 rounded-lg ${className}`}>
      <h3 className={`text-lg font-semibold ${textClass}`}>{name}</h3>
      {description && <p className={`text-sm mt-1 ${textClass}`}>{description}</p>}
      <div className={`mt-2 text-sm ${textClass} opacity-75`}>
        {className}
      </div>
    </div>
  )
}
