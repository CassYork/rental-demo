import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container } from "@medusajs/ui"
import { Pencil } from "@medusajs/icons"
import { Header } from "../../components/header"
import { useState } from "react"
import { ProductReservationDrawer } from "./reservation-drawer"

// The widget
const ProductReservationWidget = () => {

  const [editOpen, setEditOpen] = useState(false);
  
  return (
    <Container className="divide-y p-0">
      <Header 
        title="Reservation"
        actions={[
          {
            type: "action-menu",
            props: {
              groups: [
                {
                  actions: [
                    {
                      icon: <Pencil />,
                      label: "Edit",
                      onClick: () => {
                        setEditOpen(true)
                      },
                    },
                  ],
                },
              ],
            },
          },
        ]}
      />
      <ProductReservationDrawer
        open={editOpen}
        setOpen={setEditOpen}
      />
    </Container>
  )
}

// The widget's configurations
export const config = defineWidgetConfig({
  zone: "product.details.side.before",
})

export default ProductReservationWidget