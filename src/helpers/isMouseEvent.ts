export function isMouseEvent(
  event: React.MouseEvent | React.KeyboardEvent | React.FocusEvent,
): event is React.MouseEvent {
  return (event as React.MouseEvent).clientX !== undefined;
}
