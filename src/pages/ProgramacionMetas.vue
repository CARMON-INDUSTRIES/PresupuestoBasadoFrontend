<template>
  <q-page padding style="background-color: #691b31">
    <q-card flat bordered class="q-pa-md" style="max-width: 800px; margin: auto">
      <q-card-section>
        <div class="text-h5 text-center text-black">Metas Programadas</div>
      </q-card-section>

      <q-card-section>
        <q-markup-table flat bordered>
          <thead>
            <tr>
              <th>Mes</th>
              <th>Cantidad Programada</th>
              <th>Alcanzado</th>
              <th>Fecha</th>
              <th>Evidencia</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(meta, index) in programacionMetas" :key="index">
              <td>{{ meta.mes }}</td>
              <td>{{ meta.cantidad }}</td>
              <td>
                <q-input
                  v-model.number="meta.alcanzado"
                  type="number"
                  dense
                  filled
                  @blur="guardarLocalStorage"
                />
              </td>
              <td>
                <q-input
                  v-model="meta.fecha"
                  type="date"
                  dense
                  filled
                  @blur="guardarLocalStorage"
                />
              </td>
              <td>
                <q-btn
                  dense
                  flat
                  icon="upload"
                  label="Subir"
                  color="primary"
                  @click="subirEvidencia(index)"
                />
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn color="primary" label="Guardar Cambios" @click="guardarLocalStorage" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Notify } from 'quasar'

const programacionMetas = ref([])

onMounted(() => {
  const local = localStorage.getItem('fichaIndicador')
  if (local) {
    const ficha = JSON.parse(local)
    programacionMetas.value = ficha.programacionMetas || []
  }
})

function guardarLocalStorage() {
  const local = localStorage.getItem('fichaIndicador')
  if (!local) return

  const ficha = JSON.parse(local)
  ficha.programacionMetas = programacionMetas.value
  localStorage.setItem('fichaIndicador', JSON.stringify(ficha))
  Notify.create({ type: 'positive', message: 'Metas guardadas correctamente' })
}

function subirEvidencia(index) {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.jpg,.png,.pdf,.docx'
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    Notify.create({
      type: 'positive',
      message: `Evidencia "${file.name}" para ${programacionMetas.value[index].mes} cargada.`,
    })
  }
  input.click()
}
</script>
