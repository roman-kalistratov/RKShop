export const vat = (price) => {
  const vat = 5;
  return Math.round((price / 100) * vat);
};
