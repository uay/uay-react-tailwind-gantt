export function isKeyboardEvent(
  event: React.MouseEvent | React.KeyboardEvent | React.FocusEvent,
): event is React.KeyboardEvent {
  return (event as React.KeyboardEvent).key !== undefined;
}
