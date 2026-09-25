<template>
  <q-card-section>
    <div class="text-h6 q-mb-md">Programación de Metas</div>

    <q-option-group
      v-model="modoProgramacion"
      :options="[
        { label: 'Prorratear automáticamente', value: 'prorratear' },
        { label: 'Ingresar manualmente', value: 'manual' },
      ]"
      type="radio"
      inline
      class="q-mb-md"
    />

    <q-markup-table flat bordered>
      <thead>
        <tr>
          <th>Mes</th>
          <th>Cantidad</th>
          <th>% Esperado</th>
          <th>Alcanzado</th>
          <th>% Alcanzado</th>
          <th>Fecha</th>
          <th>Semáforo</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(meta, index) in localProgramacionMetas" :key="'meta-mes-' + index">
          <td>{{ meta.mes }}</td>
          <td>
            <q-input
              v-model.number="meta.cantidad"
              :disable="modoProgramacion === 'prorratear'"
              dense
              filled
              type="number"
            />
          </td>
          <td>{{ calcularPorcentajeEsperado(meta) }}%</td>
          <td>
            <q-input v-model.number="meta.alcanzado" dense filled type="number" />
          </td>
          <td>{{ calcularPorcentajeAlcanzado(meta) }}%</td>
          <td>
            <q-input v-model="meta.fecha" type="date" dense filled />
          </td>
          <td>
            <q-chip :color="calcularSemaforo(meta)" text-color="white">
              {{
                calcularSemaforo(meta) === 'green'
                  ? 'VERDE'
                  : calcularSemaforo(meta) === 'yellow'
                    ? 'AMARILLO'
                    : 'ROJO'
              }}
            </q-chip>
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </q-card-section>
</template>
<script>
import { inject } from 'vue'

export default {
  setup() {
    return inject('MetasIndicador')
  },
}
</script>
<style scoped src="src/css/pages/MetasIndicador.css" />
