<template>
  <nav v-if="current >= 0" class="workflow" aria-label="Recorrido del expediente">
    <div class="workflow-heading">
      <strong>Paso {{ current + 1 }} de {{ steps.length }} · {{ steps[current].label }}</strong>
      <button type="button" class="workflow-toggle" :aria-expanded="expanded" @click="expanded = !expanded">
        {{ expanded ? 'Ocultar recorrido' : 'Ver todo el recorrido' }}
      </button>
    </div>
    <ol class="workflow-list" :class="{ expanded }">
      <li v-for="{ step, index } in visibleSteps" :key="step.path">
        <router-link :to="step.path" :aria-current="index === current ? 'step' : undefined" :class="{ current: index === current }">
          <span class="step-number">{{ index + 1 }}</span><span>{{ step.label }}</span>
        </router-link>
      </li>
    </ol>
    <p>El recorrido indica tu ubicación; no confirma que los apartados estén completos.</p>
  </nav>
</template>
<script setup>
import { computed, ref } from 'vue'
import { steps } from './steps.js'
const props = defineProps({ path: { type: String, required: true } })
const current = computed(() => steps.findIndex(step => step.path.toLowerCase() === props.path.toLowerCase()))
const expanded = ref(false)
const visibleSteps = computed(() => steps.map((step, index) => ({ step, index })).filter(({ index }) => expanded.value || Math.abs(index - current.value) <= 1))
</script>
<style scoped>
.workflow { margin: 24px 32px 0; padding: 20px 24px; background: white; border: 1px solid #d7d3d0; border-radius: 8px; }
.workflow-heading { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
.workflow-toggle { background: transparent; border: 0; color: #691b31; text-decoration: underline; cursor: pointer; font: inherit; min-height: 44px; }
.workflow-list { display: flex; gap: 16px; list-style: none; padding: 0; margin: 16px 0 0; }
.workflow-list li { flex: 1; min-width: 0; }
.workflow-list a { display: flex; align-items: center; gap: 10px; padding: 12px; color: #625e62; text-decoration: none; border-radius: 6px; height: 100%; }
.workflow-list a:hover { background: #f5f4f1; text-decoration: underline; }
.workflow-list a.current { color: #691b31; background: #f5ecef; font-weight: 600; }
.step-number { display: grid; place-items: center; min-width: 28px; height: 28px; border: 1px solid currentColor; border-radius: 50%; }
.current .step-number { color: white; background: #691b31; }
.expanded { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
p { font-size: .8125rem; color: #625e62; margin: 12px 0 0; }
@media(max-width:700px) { .workflow { margin: 16px 16px 0; padding: 16px; } .workflow-list { flex-direction: column; gap: 4px; } }
</style>
