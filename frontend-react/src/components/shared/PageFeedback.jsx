export function PageError({ mensaje, children }) {
  return (
    <div className="alert alert-danger" role="alert">
      {mensaje}
      {children}
    </div>
  );
}

export function EmptyState({ mensaje, children }) {
  return (
    <div className="alert alert-info" role="status">
      {mensaje}
      {children}
    </div>
  );
}
