import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="container my-5 text-center">
      <h1 className="h2">No encontramos esa página</h1>
      <p className="mb-4">Puede que el enlace haya cambiado o ya no exista.</p>
      <Link to="/" className="btn btn-success">Volver al inicio</Link>
    </main>
  );
}
