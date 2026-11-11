import { Link, useParams } from "react-router-dom";
import { useOrders } from "../../context/useOrders.js";
import OrderDetails from "../../components/orders/OrderDetails.jsx";
import { EmptyState, PageError } from "../../components/shared/PageFeedback.jsx";

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const { buscar, error } = useOrders();
  let orden = null;
  let errorBusqueda = "";

  if (!error) {
    try {
      orden = buscar(id);
    } catch (fallo) {
      errorBusqueda = fallo instanceof Error ? fallo.message : "Error al leer la orden.";
    }
  }

  if (error || errorBusqueda) {
    return <PageError mensaje={`No se pudo cargar la orden: ${error || errorBusqueda}`} />;
  }
  if (!orden) {
    return (
      <EmptyState mensaje="No encontramos esa orden.">
        <div className="mt-2"><Link to="/admin/ordenes">Volver a órdenes</Link></div>
      </EmptyState>
    );
  }

  return (
    <section className="container-fluid">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <h1 className="h3 mb-1">Orden {orden.id}</h1>
          <p className="text-muted mb-0">
            {new Date(orden.creadoEn).toLocaleString("es-CL")} · Resultado de demostración: {orden.resultadoDemostracion}
          </p>
        </div>
        <Link className="btn btn-outline-success" to="/admin/ordenes">Volver a órdenes</Link>
      </div>
      <OrderDetails orden={orden} />
    </section>
  );
}
