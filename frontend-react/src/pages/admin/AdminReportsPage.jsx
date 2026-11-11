import { useOrders } from "../../context/useOrders.js";
import { useProducts } from "../../context/useProducts.js";
import { useUsers } from "../../context/useUsers.js";
import { formatoCLP } from "../../services/formatService.js";
import { PageError } from "../../components/shared/PageFeedback.jsx";

export default function AdminReportsPage() {
  const { ordenes, error: errorOrdenes } = useOrders();
  const { productos, error: errorProductos } = useProducts();
  const { usuarios, error: errorUsuarios } = useUsers();
  const error = errorOrdenes || errorProductos || errorUsuarios;
  if (error) return <PageError mensaje={`No se pudo preparar el reporte: ${error}`} />;

  const exitosas = ordenes.filter((orden) => orden.resultadoDemostracion === "exito");
  const totalDemostrativo = exitosas.reduce((suma, orden) => suma + orden.total, 0);
  const productosActivos = productos.filter((producto) => producto.activo);

  return (
    <section className="container-fluid">
      <h1 className="h3 mb-2">Reportes</h1>
      <p className="text-muted mb-4">Resumen calculado con datos guardados en este navegador; no representa ventas reales.</p>
      <div className="row g-3">
        {[
          ["Órdenes registradas", ordenes.length],
          ["Órdenes exitosas (demo)", exitosas.length],
          ["Total de órdenes exitosas (demo)", formatoCLP(totalDemostrativo)],
          ["Productos activos", productosActivos.length],
          ["Usuarios locales", usuarios.length],
        ].map(([titulo, valor]) => (
          <div className="col-12 col-sm-6 col-xl-4" key={titulo}>
            <div className="card h-100 shadow-sm"><div className="card-body">
              <h2 className="h6 text-muted">{titulo}</h2><p className="h3 fw-bold">{valor}</p>
            </div></div>
          </div>
        ))}
      </div>
    </section>
  );
}
