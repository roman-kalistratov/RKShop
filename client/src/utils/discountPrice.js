export const discountPrice = (price, percentage) => {
    return Math.round(price - price/100*percentage);
}