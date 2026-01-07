export const getProvince = (addressComponents: any[]) => {
  if (!Array.isArray(addressComponents)) return null;

  const province = addressComponents.find(comp => {
    const name = comp.long_name || '';
    return (
      name.includes('Tỉnh') ||
      name.includes('Thành phố') ||
      name.startsWith('TP') ||
      name.startsWith('Tp')
    );
  });

  if (!province) return null;

  // Xóa tiền tố "Tỉnh", "Thành phố", "TP", "Tp"
  return province.long_name
    .replace(/^Tỉnh\s*/i, '')
    .replace(/^Thành phố\s*/i, '')
    .replace(/^TP[\.\s]*/i, '')
    .replace(/^Tp[\.\s]*/i, '')
    .trim();
};
