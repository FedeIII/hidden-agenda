export default function getWrapperName(HocName, WrappedComponent) {
  return `${HocName}(${WrappedComponent.displayName ||
    WrappedComponent.name ||
    'Component'})`;
}
