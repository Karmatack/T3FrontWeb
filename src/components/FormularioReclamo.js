import React, { useState, useEffect } from "react";
import axios from "axios"; // Para realizar solicitudes HTTP

const FormularioReclamo = () => {
  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    tipoDocumento: "",
    numeroDocumento: "",
    apellidos: "",
    nombres: "",
    departamento: "",
    provincia: "",
    distrito: "",
    domicilio: "",
    correo: "",
    telefono: "",
    celular: "",
    fechaHecho: "",
    funcionario: "",
    descripcion: "",
  });

  // Estados para cargar opciones dinámicas
  const [tipoDocumentoOptions, setTipoDocumentoOptions] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState("");
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState("");

  // Cargar tipos de documento al montar el componente
  useEffect(() => {
    const fetchTipoDocumentoOptions = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/tipo-documento");
        setTipoDocumentoOptions(response.data);
      } catch (error) {
        console.error("Error al obtener los tipos de documento:", error);
      }
    };

    fetchTipoDocumentoOptions();
  }, []);

  // Cargar ubicaciones al montar el componente
  useEffect(() => {
    const fetchUbicaciones = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/ubicaciones");
        setUbicaciones(response.data);
      } catch (error) {
        console.error("Error al obtener las ubicaciones:", error);
      }
    };

    fetchUbicaciones();
  }, []);

  // Manejar cambios en los inputs del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Manejar el cambio de Departamento
  const handleDepartamentoChange = (e) => {
    const value = e.target.value;
    setDepartamentoSeleccionado(value);
    setFormData({ ...formData, departamento: value, provincia: "", distrito: "" }); // Reiniciar provincia y distrito
  };

  // Manejar el cambio de Provincia
  const handleProvinciaChange = (e) => {
    const value = e.target.value;
    setProvinciaSeleccionada(value);
    setFormData({ ...formData, provincia: value, distrito: "" }); // Reiniciar distrito
  };

  // Manejar el cambio de Distrito
  const handleDistritoChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, distrito: value });
  };

  // Enviar los datos del formulario al backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    const reclamoData = {
      ...formData,
      tipoDocumento: { id: formData.tipoDocumento },
      ubicacion: { id: ubicaciones.find(
          (u) =>
            u.departamento === formData.departamento &&
            u.provincia === formData.provincia &&
            u.distrito === formData.distrito
        )?.id },
    };

    try {
      const response = await axios.post("http://localhost:8080/api/reclamos", reclamoData);
      console.log("Reclamo enviado exitosamente:", response.data);
      alert("Reclamo enviado correctamente.");

      // Reiniciar el formulario
      setFormData({
        tipoDocumento: "",
        numeroDocumento: "",
        apellidos: "",
        nombres: "",
        departamento: "",
        provincia: "",
        distrito: "",
        domicilio: "",
        correo: "",
        telefono: "",
        celular: "",
        fechaHecho: "",
        funcionario: "",
        descripcion: "",
      });
      setDepartamentoSeleccionado("");
      setProvinciaSeleccionada("");
    } catch (error) {
      console.error("Error al enviar el reclamo:", error);
      alert("Hubo un error al enviar el reclamo.");
    }
  };

  // Filtrar provincias y distritos según selección
  const provinciasFiltradas = ubicaciones.filter(
    (u) => u.departamento === departamentoSeleccionado
  );
  const distritosFiltrados = provinciasFiltradas.filter(
    (u) => u.provincia === provinciaSeleccionada
  );

  return (
    <div className="container mt-5">
      <h2>Gestión de Reclamos</h2>
      <form onSubmit={handleSubmit}>
        {/* SECCIÓN: Tipo de Documento */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="tipoDocumento" className="form-label">
              Tipo de Documento
            </label>
            <select
              id="tipoDocumento"
              name="tipoDocumento"
              className="form-control"
              value={formData.tipoDocumento}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione...</option>
              {tipoDocumentoOptions.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="numeroDocumento" className="form-label">
              Número de Documento
            </label>
            <input
              type="text"
              id="numeroDocumento"
              name="numeroDocumento"
              className="form-control"
              value={formData.numeroDocumento}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* SECCIÓN: Apellidos y Nombres */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="apellidos" className="form-label">
              Apellidos
            </label>
            <input
              type="text"
              id="apellidos"
              name="apellidos"
              className="form-control"
              value={formData.apellidos}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="nombres" className="form-label">
              Nombres
            </label>
            <input
              type="text"
              id="nombres"
              name="nombres"
              className="form-control"
              value={formData.nombres}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* SECCIÓN: Ubicación */}
        <div className="row">
          <div className="col-md-4 mb-3">
            <label htmlFor="departamento" className="form-label">
              Departamento
            </label>
            <select
              id="departamento"
              name="departamento"
              className="form-control"
              value={formData.departamento}
              onChange={handleDepartamentoChange}
              required
            >
              <option value="">Seleccione...</option>
              {[...new Set(ubicaciones.map((u) => u.departamento))].map((dep) => (
                <option key={dep} value={dep}>
                  {dep}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4 mb-3">
            <label htmlFor="provincia" className="form-label">
              Provincia
            </label>
            <select
              id="provincia"
              name="provincia"
              className="form-control"
              value={formData.provincia}
              onChange={handleProvinciaChange}
              disabled={!departamentoSeleccionado}
              required
            >
              <option value="">Seleccione...</option>
              {[...new Set(provinciasFiltradas.map((u) => u.provincia))].map((prov) => (
                <option key={prov} value={prov}>
                  {prov}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4 mb-3">
            <label htmlFor="distrito" className="form-label">
              Distrito
            </label>
            <select
              id="distrito"
              name="distrito"
              className="form-control"
              value={formData.distrito}
              onChange={handleDistritoChange}
              disabled={!provinciaSeleccionada}
              required
            >
              <option value="">Seleccione...</option>
              {distritosFiltrados.map((u) => (
                <option key={u.id} value={u.distrito}>
                  {u.distrito}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* SECCIÓN: Dirección y Contacto */}
        <div className="row">
          <div className="col-md-12 mb-3">
            <label htmlFor="domicilio" className="form-label">
              Domicilio
            </label>
            <input
              type="text"
              id="domicilio"
              name="domicilio"
              className="form-control"
              value={formData.domicilio}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="correo" className="form-label">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="correo"
              name="correo"
              className="form-control"
              value={formData.correo}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3 mb-3">
            <label htmlFor="telefono" className="form-label">
              Teléfono
            </label>
            <input
              type="text"
              id="telefono"
              name="telefono"
              className="form-control"
              value={formData.telefono}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3 mb-3">
            <label htmlFor="celular" className="form-label">
              Celular
            </label>
            <input
              type="text"
              id="celular"
              name="celular"
              className="form-control"
              value={formData.celular}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* SECCIÓN: Detalles del Reclamo */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="fechaHecho" className="form-label">
              Fecha del Hecho
            </label>
            <input
              type="date"
              id="fechaHecho"
              name="fechaHecho"
              className="form-control"
              value={formData.fechaHecho}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="funcionario" className="form-label">
              Funcionario
            </label>
            <input
              type="text"
              id="funcionario"
              name="funcionario"
              className="form-control"
              value={formData.funcionario}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* SECCIÓN: Descripción */}
        <div className="row">
          <div className="col-md-12 mb-3">
            <label htmlFor="descripcion" className="form-label">
              Descripción (máximo 1000 caracteres)
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              className="form-control"
              rows="4"
              maxLength="1000"
              value={formData.descripcion}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-success">
          Enviar
        </button>
      </form>
    </div>
  );
};

export default FormularioReclamo;
