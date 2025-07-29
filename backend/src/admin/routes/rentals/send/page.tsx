import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading } from "@medusajs/ui"

const SendRentals = () => {
  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Send Rentals Page</Heading>
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Send Rentals",
})

export default SendRentals