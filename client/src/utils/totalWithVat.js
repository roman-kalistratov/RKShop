import { vat } from "./vat";

export const totalWithVat = (price) => {
    return Math.round(price + vat(price));
}