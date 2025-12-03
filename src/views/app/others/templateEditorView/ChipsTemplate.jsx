import React, { useState, useEffect } from "react";
import "../../../../assets/styles/chips-template.css"; // Estilos opcionales

const ChipsTemplate = () => {
   // Estados
   const [plantillas, setPlantillas] = useState({});
   const [tipoPlantilla, setTipoPlantilla] = useState("");
   const [elementos, setElementos] = useState([]);
   const [elementosSeleccionados, setElementosSeleccionados] = useState([]);
   const [previewData, setPreviewData] = useState([]);

   // Datos de ejemplo basados en tu Excel
   const datosEjemplo = {
      "PLANTILLA A4": {
         columnas: 10, // Columnas A-J
         filas: 28, // Filas con contenido
         datos: Array(28)
            .fill()
            .map(() =>
               Array(10)
                  .fill()
                  .map((_, colIndex) => (colIndex % 2 === 1 ? "ACTIVA CON $50" : ""))
            )
      },
      "PLANTILLA TABLOIDE": {
         columnas: 14, // Columnas A-N
         filas: 40, // Filas con contenido
         datos: Array(40)
            .fill()
            .map(() =>
               Array(14)
                  .fill()
                  .map((_, colIndex) => (colIndex % 2 === 1 ? "ACTIVA CON $50" : ""))
            )
      }
   };

   // Inicializar datos
   useEffect(() => {
      setPlantillas(datosEjemplo);

      // Crear elementos para seleccionar
      const elementosIniciales = datosEjemplo["PLANTILLA A4"].datos.map((fila, index) => ({
         id: index,
         nombre: `Elemento ${index + 1}`,
         contenido: fila.filter((cell) => cell !== ""),
         seleccionado: false
      }));

      setElementos(elementosIniciales);
      setTipoPlantilla("PLANTILLA A4");
   }, []);

   // Cambiar tipo de plantilla
   const cambiarTipoPlantilla = (tipo) => {
      setTipoPlantilla(tipo);

      if (plantillas[tipo]) {
         const nuevosElementos = plantillas[tipo].datos.map((fila, index) => ({
            id: index,
            nombre: `Elemento ${index + 1}`,
            contenido: fila.filter((cell) => cell !== ""),
            seleccionado: elementosSeleccionados.some((e) => e.id === index)
         }));

         setElementos(nuevosElementos);
         generarPreview();
      }
   };

   // Seleccionar/deseleccionar elemento
   const toggleElemento = (id) => {
      const nuevosElementos = elementos.map((el) => (el.id === id ? { ...el, seleccionado: !el.seleccionado } : el));

      setElementos(nuevosElementos);
      setElementosSeleccionados(nuevosElementos.filter((el) => el.seleccionado));
   };

   // Seleccionar todos
   const seleccionarTodos = () => {
      const todosSeleccionados = elementos.map((el) => ({ ...el, seleccionado: true }));
      setElementos(todosSeleccionados);
      setElementosSeleccionados(todosSeleccionados);
   };

   // Deseleccionar todos
   const deseleccionarTodos = () => {
      const todosDeseleccionados = elementos.map((el) => ({ ...el, seleccionado: false }));
      setElementos(todosDeseleccionados);
      setElementosSeleccionados([]);
   };

   // Generar preview
   const generarPreview = () => {
      if (!tipoPlantilla || !plantillas[tipoPlantilla]) return;

      const plantilla = plantillas[tipoPlantilla];
      const columnas = plantilla.columnas;

      // Crear matriz vacía
      const matrizPreview = Array(plantilla.filas)
         .fill()
         .map(() => Array(columnas).fill(""));

      // Llenar con elementos seleccionados
      elementosSeleccionados.forEach((el, index) => {
         if (index < plantilla.filas) {
            // Mantener el patrón del Excel (texto en columnas impares)
            for (let col = 0; col < columnas; col++) {
               if (col % 2 === 1) {
                  matrizPreview[index][col] = "ACTIVA CON $50";
               }
            }
         }
      });

      setPreviewData(matrizPreview);
   };

   // Exportar a Excel
   const exportarExcel = () => {
      generarPreview();

      const wsData = previewData.length > 0 ? previewData : plantillas[tipoPlantilla].datos.filter((_, index) => elementosSeleccionados.some((el) => el.id === index));

      // Aquí implementarías la lógica para exportar a Excel
      // Usando librerías como xlsx o sheetjs
      console.log("Exportando datos:", wsData);
      alert(`Exportando ${elementosSeleccionados.length} elementos a plantilla ${tipoPlantilla}`);
   };

   // Efecto para actualizar preview cuando cambian selecciones
   useEffect(() => {
      generarPreview();
   }, [elementosSeleccionados, tipoPlantilla]);

   return (
      <div className="plantilla-container">
         {/* Selector de tipo de plantilla */}
         <div className="selector-plantilla">
            <h2>Seleccionar Tipo de Plantilla</h2>
            <div className="botones-plantilla">
               {Object.keys(plantillas).map((tipo) => (
                  <button key={tipo} className={`boton-tipo ${tipoPlantilla === tipo ? "activo" : ""}`} onClick={() => cambiarTipoPlantilla(tipo)}>
                     {tipo}
                  </button>
               ))}
            </div>
         </div>

         {/* Panel de selección de elementos */}
         <div className="panel-seleccion">
            <div className="panel-header">
               <h2>
                  Seleccionar Elementos ({elementosSeleccionados.length}/{elementos.length})
               </h2>
               <div className="controles-masivos">
                  <button onClick={seleccionarTodos}>Seleccionar Todos</button>
                  <button onClick={deseleccionarTodos}>Deseleccionar Todos</button>
               </div>
            </div>

            <div className="lista-elementos">
               {elementos.map((elemento) => (
                  <div key={elemento.id} className={`elemento-item ${elemento.seleccionado ? "seleccionado" : ""}`} onClick={() => toggleElemento(elemento.id)}>
                     <input type="checkbox" checked={elemento.seleccionado} onChange={() => toggleElemento(elemento.id)} />
                     <span className="elemento-nombre">{elemento.nombre}</span>
                     <span className="elemento-contenido">{elemento.contenido.join(", ")}</span>
                  </div>
               ))}
            </div>
         </div>

         {/* Preview de la plantilla */}
         <div className="panel-preview">
            <h2>Vista Previa: {tipoPlantilla}</h2>
            <div className="preview-container">
               <div className="preview-tabla">
                  <table>
                     <tbody>
                        {previewData.slice(0, 10).map((fila, rowIndex) => (
                           <tr key={rowIndex}>
                              {fila.map((celda, colIndex) => (
                                 <td key={colIndex} className={celda ? "con-datos" : "sin-datos"}>
                                    {celda || " "}
                                 </td>
                              ))}
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
            <div className="estadisticas">
               <p>Columnas: {plantillas[tipoPlantilla]?.columnas || 0}</p>
               <p>Filas mostradas: {previewData.length}</p>
               <p>Elementos seleccionados: {elementosSeleccionados.length}</p>
            </div>
         </div>

         {/* Botón de exportación */}
         <div className="panel-acciones">
            <button className="boton-exportar" onClick={exportarExcel} disabled={elementosSeleccionados.length === 0}>
               Generar Plantilla con {elementosSeleccionados.length} Elementos
            </button>
         </div>
      </div>
   );
};

export default ChipsTemplate;
