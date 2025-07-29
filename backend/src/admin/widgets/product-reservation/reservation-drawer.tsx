import { Drawer, toast } from "@medusajs/ui";
import { CompanyDTO } from "src/modules/company/types/common";
import { UpdateCompanyDTO } from "src/modules/company/types/mutations";
import { useUpdateCompany } from "../../hooks";
import { ReservationForm } from "./reservation-form";

export function ProductReservationDrawer({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {

  const handleSubmit = async (formData: UpdateCompanyDTO) => {
    // await mutate(formData).then(() => {
    //   setOpen(false);
    //   toast.success(`Product reservation updated successfully`);
    // });
    setOpen(false);
      toast.success(`Product reservation updated successfully`);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <Drawer.Content className="z-50">
        <Drawer.Header>
          <Drawer.Title>Update Product Reservation</Drawer.Title>
        </Drawer.Header>

        <ReservationForm
          data={{}}
          handleSubmit={handleSubmit}
          loading={false}
          error={null}
        />
      </Drawer.Content>
    </Drawer>
  );
}
