// Format price helper
export const formatPrice = price => {
  if (!price) return 'Liên hệ';
  const numPrice = typeof price === 'string' ? parseInt(price) : price;
  if (numPrice >= 1000) {
    return `${(numPrice / 1000).toFixed(1)} triệu`;
  } else if (numPrice >= 1) {
    return `${(numPrice / 1).toFixed(0)}k`;
  }
  return `${numPrice}đ`;
};
