import { defineRouteConfig } from "@medusajs/admin-sdk";
import { DocumentText } from "@medusajs/icons";
import { Container, Heading, Toaster } from "@medusajs/ui";

const Rental = () => {
  return (
    <>
      <Container className="flex flex-col p-0 overflow-hidden">
        <Heading className="p-6 pb-0 font-sans font-medium h1-core">
          Renttal Page
        </Heading>

      </Container>
      <Toaster />
    </>
  );
};

export const config = defineRouteConfig({
  label: "Rentals",
  icon: DocumentText,
});

export default Rental;
