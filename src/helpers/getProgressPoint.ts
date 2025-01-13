export const getProgressPoint = (
  progressX: number,
  taskY: number,
  taskHeight: number,
) => {
  const point = [
    progressX - 5,
    taskY + taskHeight,
    progressX + 5,
    taskY + taskHeight,
    progressX,
    taskY + taskHeight - 8.66,
  ];
  return point.join(',');
};
