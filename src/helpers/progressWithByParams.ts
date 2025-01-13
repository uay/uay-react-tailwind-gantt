export const progressWithByParams = (
  taskX1: number,
  taskX2: number,
  progress: number,
  rtl: boolean,
) => {
  const progressWidth = (taskX2 - taskX1) * progress * 0.01;
  let progressX: number;
  if (rtl) {
    progressX = taskX2 - progressWidth;
  } else {
    progressX = taskX1;
  }
  return [progressWidth, progressX];
};
