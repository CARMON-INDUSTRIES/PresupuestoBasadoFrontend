# Medición local de esperas

Iniciar el frontend con `npm run dev` y recorrer las pantallas normalmente. En las herramientas del navegador (F12), pestaña Consola, ejecutar:

```js
console.table(window.pbrRendimiento.consultar())
```

Para comenzar una medición limpia:

```js
window.pbrRendimiento.limpiar()
```

Se agrupan hasta 200 muestras en memoria, solo en desarrollo. No se almacenan credenciales, parámetros ni contenido de los registros. Al recargar se eliminan las muestras.

- **red**: tiempo desde el envío hasta la respuesta de la API; incluye red y servidor, no los separa.
- **consulta compartida / caché**: espera por una consulta en curso o reutilización de una respuesta.
- **preparación de datos**: copia local de la respuesta para entregar datos independientes al formulario.
- **navegación**: resolución de la ruta desde el guard global; no incluye guardas de salida anteriores.
- **vista inicial**: actualización de Vue y llegada al siguiente cuadro; no equivale a la carga completa de catálogos ni mide todo el trabajo del navegador.

Comparar una primera visita y una segunda visita a la misma pantalla. El máximo y el promedio orientan dónde investigar; estos valores no justifican por sí solos cambiar cachés o consultas.

No se realizaron mediciones reales desde navegador durante esta implementación, por indicación del propietario.
