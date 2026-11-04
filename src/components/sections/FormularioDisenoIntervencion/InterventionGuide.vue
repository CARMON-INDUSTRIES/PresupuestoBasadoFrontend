<template>
  <section class="intervention-guide" aria-label="Orientación y revisión de la intervención">
    <details>
      <summary>¿Cómo organizar la intervención?</summary>
      <ol>
        <li>Agrega los bienes o servicios que entregará el programa como componentes.</li>
        <li>Registra las actividades de cada componente y sus cantidades programadas.</li>
        <li>Describe el efecto esperado, los cursos de acción y los escenarios futuros.</li>
      </ol>
      <p>Ejemplo: talleres impartidos → organizar e impartir sesiones → participantes con mayores conocimientos.</p>
    </details>
    <div class="review-heading"><strong>Revisión de captura</strong><span>{{ form.componentes.length }} componentes · {{ activityCount }} actividades</span></div>
    <ul v-if="pending.length"><li v-for="item in pending" :key="item">{{ item }}</li></ul>
    <p v-else>Los apartados tienen información. Revisa su contenido antes de continuar.</p>
    <small>Esta revisión orienta la captura; no sustituye la validación del contenido ni confirma el guardado.</small>
  </section>
</template>
<script setup>
import { computed } from 'vue'
const props = defineProps({ form: { type: Object, required: true } })
const activityCount = computed(() => props.form.componentes.reduce((total, comp) => total + comp.acciones.length, 0))
const hasText = value => Boolean(String(value ?? '').replace(/^[\d.]+\s*/, '').trim())
const pending = computed(() => {
  const form = props.form
  const items = []
  if (!form.componentes.length) items.push('Agrega al menos un componente.')
  form.componentes.forEach((comp, i) => {
    if (!hasText(comp.nombre)) items.push(`Componente ${i + 1}: revisa el nombre.`)
    if (!comp.acciones.length || comp.acciones.some(a => !hasText(a.descripcion))) items.push(`Componente ${i + 1}: describe sus actividades.`)
    if (comp.acciones.some(a => !(Number(a.cantidad) > 0))) items.push(`Componente ${i + 1}: revisa las cantidades programadas en cero o vacías.`)
    if (!hasText(typeof comp.resultado === 'string' ? comp.resultado : comp.resultado?.descripcion)) items.push(`Componente ${i + 1}: describe el efecto esperado.`)
  })
  if (!hasText(form.etapasIntervencion)) items.push('Describe los cursos de acción.')
  if (!hasText(form.escenariosFuturosEsperar)) items.push('Describe los escenarios futuros esperados.')
  return items
})
</script>
<style scoped>
.intervention-guide { padding: 20px; background: #f5f4f1; border-radius: 8px; line-height: 1.6; }
summary { color: #691b31; cursor: pointer; font-weight: 600; padding: 4px 0; }
.review-heading { display: flex; flex-wrap: wrap; gap: 8px 24px; justify-content: space-between; margin-top: 16px; }
ul, ol { padding-left: 24px; margin: 12px 0; }
small { color: #625e62; }
p { margin: 12px 0; }
</style>
