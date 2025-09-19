export const convertToK = price => {
  // ép thành number
  const numPrice = Number(price);

  // nếu không phải số thì gán = 0
  const validPrice = isNaN(numPrice) ? 0 : numPrice;

  if (validPrice >= 1000000) {
    return `${validPrice / 1000000}Tr`;
  } else if (validPrice >= 1000) {
    return `${validPrice / 1000}K`;
  }
  return validPrice.toString();
};
