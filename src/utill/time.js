export const getFormattedTime = (time = new Date()) => {
  const now = new Date(time); // ép kiểu ở đây
  const currentTime = new Date(); // ép kiểu ở đây

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const dayCurrent = String(currentTime.getDate()).padStart(2, '0');
  const monthCurrent = String(currentTime.getMonth() + 1).padStart(2, '0');
  const yearCurrent = currentTime.getFullYear();
  if (year === yearCurrent && month === monthCurrent && day === dayCurrent) {
    return `${hours}:${minutes}`;
  } else {
    return `${day}/${month}/${year}`;
  }
};
