import { createLazyFileRoute } from '@tanstack/react-router'
import { LandingLayout } from '@/components/layout/landing-layout'

export const Route = createLazyFileRoute('/features/')({
  component: RouteComponent,
})

function RouteComponent() {
  return(
  <LandingLayout>
  <div>Features content</div>
</LandingLayout>
  ) 
}