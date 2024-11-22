import React, { useState, useEffect } from "react";
import { deleteProduct, getProducts } from '../services/productService'; // Importa las funciones del servicio

function ProductsList({ onSwitchView }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [reloadProducts, setReloadProducts] = useState(false); // Estado para controlar cuando recargar los productos

  // Función para obtener la lista de productos desde el backend
  const fetchProducts = async () => {
    try {
      const response = await getProducts(); // Obtener los productos activos
      setProducts(response.Items);
    } catch (err) {
      console.error("Error al cargar los productos:", err);
      alert("Error al cargar los productos. Intenta nuevamente.");
    }
  };

  // Ejecutar fetchProducts cada vez que el campo de búsqueda cambie o cuando se marque para recargar
  useEffect(() => {
    fetchProducts(); // Recargar productos cuando cambie la búsqueda o cuando `reloadProducts` cambie
  }, [search, reloadProducts]); // Dependencias: campo de búsqueda y recarga de productos

  // Función para manejar la eliminación de un producto
  const handleDelete = async (id_articulo) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este producto?");
    if (!confirmar) return;

    try {
      await deleteProduct(id_articulo); // Llamar a la función de eliminación
      alert("Producto eliminado exitosamente.");
      setReloadProducts(prev => !prev); // Marcar que los productos deben recargarse
    } catch (err) {
      console.error("Error al intentar eliminar el producto:", err.message);
      alert("Ocurrió un error. Por favor, intenta nuevamente.");
    }
  };

  return (
    <div>
      <h1>Lista de Productos</h1>
      <button className="btn btn-primary mb-3" onClick={() => onSwitchView("form")}>
        Nuevo Producto
      </button>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Acciones</th> {/* Eliminar la columna "Activo" */}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id_articulo}>
              <td>{product.nombre_articulo}</td>
              <td>{product.precio}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => onSwitchView("form", product)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(product.id_articulo)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductsList;