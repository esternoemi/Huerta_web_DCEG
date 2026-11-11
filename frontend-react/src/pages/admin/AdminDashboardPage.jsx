
import { Link } from "react-router-dom";
import { useProducts } from "../../context/useProducts.js";
import { useCategories } from "../../context/useCategories.js";
import { useUsers } from "../../context/useUsers.js";
import { useOrders } from "../../context/useOrders.js";
import { formatoCLP } from "../../services/formatService.js";

export default function AdminDashboardPage() {
  const { productos, error: errorProductos } = useProducts();
  const { categorias, error: errorCategorias } = useCategories();
  const { usuarios, error: errorUsuarios } = useUsers();
  const { ordenes, error: errorOrdenes } = useOrders();

  const erroresCarga = [
    errorProductos && `Productos: ${errorProductos}`,
    errorCategorias && `Categorías: ${errorCategorias}`,
    errorUsuarios && `Usuarios: ${errorUsuarios}`,
    errorOrdenes && `Órdenes: ${errorOrdenes}`,
  ].filter(Boolean);

  if (erroresCarga.length > 0) {
    return (
      <div className="container-fluid">
        <h1 className="h3 mb-3">Dashboard administrativo</h1>
        <div className="alert alert-danger" role="alert">
          No se puede calcular el resumen porque falló la carga de datos:
          <ul className="mb-0 mt-2">
            {erroresCarga.map((mensaje) => <li key={mensaje}>{mensaje}</li>)}
          </ul>
        </div>
      </div>
    );
  }

  const totalProductos = productos.length;
  const totalCategorias = categorias.length;
  const totalUsuarios = usuarios.length;
  const totalOrdenes = ordenes.length;

  const ordenesExitosas = ordenes.filter(
    (orden) => orden.resultadoDemostracion === "exito"
  );

  const totalVentas = ordenesExitosas.reduce(
    (total, orden) => total + orden.total,
    0
  );

  const tarjetas = [
    {
      titulo: "Productos",
      valor: totalProductos,
      ruta: "/admin/productos",
      color: "success",
    },
    {
      titulo: "Categorías",
      valor: totalCategorias,
      ruta: "/admin/categorias",
      color: "primary",
    },
    {
      titulo: "Usuarios",
      valor: totalUsuarios,
      ruta: "/admin/usuarios",
      color: "warning",
    },
    {
      titulo: "Órdenes",
      valor: totalOrdenes,
      ruta: "/admin/ordenes",
      color: "info",
    },
  ];

  return (
    <div className="container-fluid">
      <h1 className="h3 mb-2">Dashboard administrativo</h1>
      <p className="text-muted mb-4">
        Resumen general de Huerto Hogar.
      </p>

      <div className="row g-3 mb-4">
        {tarjetas.map((tarjeta) => (
          <div className="col-12 col-sm-6 col-xl-3" key={tarjeta.titulo}>
            <div className={`card border-${tarjeta.color} h-100 shadow-sm`}>
              <div className="card-body">
                <h2 className="h6 text-muted">{tarjeta.titulo}</h2>
                <p className="display-6 fw-bold mb-3">{tarjeta.valor}</p>
                <Link to={tarjeta.ruta} className="btn btn-sm btn-outline-dark">
                  Ver detalles
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h2 className="h5">Resumen de ventas demostrativas</h2>
          <p className="display-6 text-success fw-bold mb-1">
            {formatoCLP(totalVentas)}
          </p>
          <p className="text-muted mb-0">
            Total correspondiente a {ordenesExitosas.length} órdenes exitosas.
            No representa pagos reales.
          </p>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="h5 mb-3">Últimas órdenes</h2>

          {ordenes.length === 0 ? (
            <p className="text-muted mb-0">
              Todavía no existen órdenes registradas.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Número de orden</th>
                    <th>Cliente</th>
                    <th>Estado</th>
                    <th>Total</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {[...ordenes]
                    .sort(
                      (a, b) =>
                        new Date(b.creadoEn) - new Date(a.creadoEn)
                    )
                    .slice(0, 5)
                    .map((orden) => (
                      <tr key={orden.id}>
                        <td>{orden.id}</td>
                        <td>
                          {orden.cliente.nombre} {orden.cliente.apellido}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              orden.resultadoDemostracion === "exito"
                                ? "bg-success"
                                : "bg-danger"
                            }`}
                          >
                            {orden.estado}
                          </span>
                        </td>
                        <td>{formatoCLP(orden.total)}</td>
                        <td>
                          <Link
                            to={`/admin/ordenes/${encodeURIComponent(orden.id)}`}
                            className="btn btn-sm btn-outline-success"
                          >
                            Ver orden
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
