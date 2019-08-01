export default function getWrapperName(WrappedComponent) {
  return `WithPlayersState(${WrappedComponent.displayName ||
    WrappedComponent.name ||
    'Component'})`;
}
