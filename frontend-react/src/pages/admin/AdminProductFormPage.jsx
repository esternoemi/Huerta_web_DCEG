
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../../context/useProducts.js";
import { useCategories } from "../../context/useCategories.js";

export default function AdminProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { productos, crear, actualizar } = useProducts();
  const { categorias } = useCategories();

  const editando = Boolean(id);
  const productoActual = productos.find(
    (producto) => String(producto.id) === String(id)
  );

  const [formulario, setFormulario] = useState(() => ({
    nombre: productoActual?.nombre ?? "",
    categoriaId: productoActual?.categoriaId ?? "",
    precio: productoActual?.precio ?? "",
    unidadVenta: productoActual?.unidadVenta ?? "",
    stock: productoActual?.stock ?? "",
    unidadStock: productoActual?.unidadStock ?? "",
    descripcion: productoActual?.descripcion ?? "",
    origen: productoActual?.origen ?? "",
    imagen: productoActual?.imagen ?? "",
    activo: productoActual?.activo ?? true,
    proximo: productoActual?.proximo ?? false,
    precioOferta: productoActual?.precioOferta ?? "",
  }));

  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  function actualizarCampo(evento) {
    const { name, value, type, checked } = evento.target;

    setFormulario((actual) => ({
      ...actual,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
  }

  function guardarProducto(evento) {
    evento.preventDefault();

    if (!formulario.nombre.trim()) {
      setError("El nombre del producto es obligatorio.");
      return;
    }

    if (!formulario.categoriaId) {
      setError("Selecciona una categoría.");
      return;
    }

    if (formulario.precio === "" || Number(formulario.precio) < 0) {
      setError("Ingresa un precio válido.");
      return;
    }

    if (formulario.stock === "" || Number(formulario.stock) < 0) {
      setError("Ingresa un stock válido.");
      return;
    }

    setGuardando(true);

    try {
      const datos = {
        ...formulario,
        categoriaId: formulario.categoriaId,
        precio: Number(formulario.precio),
        stock: Number(formulario.stock),
        precioOferta:
          formulario.precioOferta === ""
            ? null
            : Number(formulario.precioOferta),
      };

      if (editando) {
        actualizar(id, datos);
      } else {
        crear(datos);
      }

      navigate("/admin/productos");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo guardar el producto."
      );
    } finally {
      setGuardando(false);
    }
  }

  if (editando && !productoActual) {
    return (
      <div className="alert alert-warning">
        <p>No se encontró el producto solicitado.</p>
        <Link to="/admin/productos">Volver a productos</Link>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <h1 className="h3 mb-4">
        {editando ? "Editar producto" : "Nuevo producto"}
      </h1>

      <div className="card shadow-sm">
        <div className="card-body">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={guardarProducto}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="nombre">
                  Nombre
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  className="form-control"
                  value={formulario.nombre}
                  onChange={actualizarCampo}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label" htmlFor="categoriaId">
                  Categoría
                </label>
                <select
                  id="categoriaId"
                  name="categoriaId"
                  className="form-select"
                  value={formulario.categoriaId}
                  onChange={actualizarCampo}
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label" htmlFor="precio">
                  Precio
                </label>
                <input
                  id="precio"
                  name="precio"
                  type="number"
                  min="0"
                  className="form-control"
                  value={formulario.precio}
                  onChange={actualizarCampo}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label" htmlFor="stock">
                  Stock
                </label>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  className="form-control"
                  value={formulario.stock}
                  onChange={actualizarCampo}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label" htmlFor="precioOferta">
                  Precio de oferta
                </label>
                <input
                  id="precioOferta"
                  name="precioOferta"
                  type="number"
                  min="0"
                  className="form-control"
                  value={formulario.precioOferta ?? ""}
                  onChange={actualizarCampo}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label" htmlFor="unidadVenta">
                  Unidad de venta
                </label>
                <input
                  id="unidadVenta"
                  name="unidadVenta"
                  className="form-control"
                  value={formulario.unidadVenta}
                  onChange={actualizarCampo}
                  placeholder="Ejemplo: kg, unidad, frasco"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label" htmlFor="unidadStock">
                  Unidad de stock
                </label>
                <input
                  id="unidadStock"
                  name="unidadStock"
                  className="form-control"
                  value={formulario.unidadStock}
                  onChange={actualizarCampo}
                  placeholder="Ejemplo: kg, unidades"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label" htmlFor="origen">
                  Origen
                </label>
                <input
                  id="origen"
                  name="origen"
                  className="form-control"
                  value={formulario.origen}
                  onChange={actualizarCampo}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label" htmlFor="imagen">
                  Imagen
                </label>
                <input
                  id="imagen"
                  name="imagen"
                  className="form-control"
                  value={formulario.imagen}
                  onChange={actualizarCampo}
                  placeholder="Ruta o URL de imagen"
                />
              </div>

              <div className="col-12">
                <label className="form-label" htmlFor="descripcion">
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  className="form-control"
                  rows="3"
                  value={formulario.descripcion}
                  onChange={actualizarCampo}
                />
              </div>

              <div className="col-12 d-flex flex-wrap gap-4">
                <label className="form-check">
                  <input
                    type="checkbox"
                    name="activo"
                    className="form-check-input"
                    checked={formulario.activo}
                    onChange={actualizarCampo}
                  />
                  <span className="form-check-label">Producto activo</span>
                </label>

                <label className="form-check">
                  <input
                    type="checkbox"
                    name="proximo"
                    className="form-check-input"
                    checked={formulario.proximo}
                    onChange={actualizarCampo}
                  />
                  <span className="form-check-label">Próximamente</span>
                </label>
              </div>
            </div>

            <div className="d-flex gap-2 mt-4">
              <button
                type="submit"
                className="btn btn-success"
                disabled={guardando}
              >
                {guardando ? "Guardando..." : "Guardar producto"}
              </button>

              <Link
                to="/admin/productos"
                className="btn btn-outline-secondary"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
