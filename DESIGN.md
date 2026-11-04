# Criterios visuales del frontend

Se conserva el nombre, los logotipos, los colores institucionales, el orden de pantallas y los formatos PDF.

- Guinda #691b31 para acciones principales y títulos; dorado #bc995b para acentos institucionales.
- Superficies claras, texto oscuro, bordes discretos y campos legibles.
- Menú compacto con ubicación actual visible; sin desplazamientos decorativos al pasar el cursor.
- Estilos compartidos en src/css/institutional.scss para mantener consistencia entre formularios.
- Mantener los campos, validaciones, guardado y servicios al ajustar la presentación.
- Respetar la preferencia de movimiento reducido y conservar el foco visible.

Validación: lint, pruebas de regresión y compilación. La inspección visual final será manual por el propietario; no se completaron pruebas visuales posteriores a los cambios por petición suya.

## Orientación y recorrido

El encabezado compartido usa src/components/workflow/steps.js y la ruta actual. Conserva el orden del menú del expediente, permite navegar y muestra los pasos cercanos o el recorrido completo. La posición no acredita que un apartado esté completo; no se presentan marcas de aprobación ficticias.

El estado de guardado se conecta a useFormularioPersistente únicamente para formularios con autosave. Distingue recuperación, cambios pendientes, envío, confirmación y error, con reintento. Los formularios con validaciones de guardado manual mantienen sus controles propios.

Diseño de la Intervención Pública es la pantalla piloto de ayuda contextual y revisión de captura. La revisión detecta contenido ausente y cantidades para revisar; no bloquea el flujo ni sustituye las reglas del sistema.
