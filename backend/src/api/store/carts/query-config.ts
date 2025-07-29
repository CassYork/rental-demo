export const cartFields = [
  "id",
  "*items",
  "*rent_items",
  "*customer",
  "*company",
  "*region",
  "currency_code",
];

export const retrieveCartTransformQueryConfig = {
  defaults: cartFields,
  isList: false,
};
