export const getPaginationData = (
  page: number,
  size: number,
  totalData: number,
) => ({
  current_page: page,
  total_page: Math.ceil(totalData / size),
  size,
  total_size: totalData,
});
