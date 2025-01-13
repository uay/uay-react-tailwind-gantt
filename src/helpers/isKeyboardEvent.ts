export function isKeyboardEvent(
  event: MouseEvent | KeyboardEvent | FocusEvent,
): event is KeyboardEvent {
  return (event as KeyboardEvent).key !== undefined;
}
