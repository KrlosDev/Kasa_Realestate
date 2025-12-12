import { createLazyFileRoute } from '@tanstack/react-router'
import { LandingLayout } from '@/components/layout/landing-layout'
import { PricingSection } from '@/components/landing/pricing-section'

export const Route = createLazyFileRoute('/pricing/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <LandingLayout>
      <PricingSection />
    </LandingLayout>
  )
}
