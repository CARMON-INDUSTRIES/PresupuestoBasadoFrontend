<template>
  <q-page padding style="background-color: #691b31">
    <q-card flat bordered class="q-pa-md" style="max-width: 1400px; margin: auto">
      <q-card-section>
        <div class="text-h5 text-center text-black">Anexo 4 - Árbol de Problemas</div>
      </q-card-section>

      <q-separator class="q-my-md" color="black" />

      <div class="arbol-container">
        <!-- EFECTO SUPERIOR -->
        <div class="nivel efecto">
          <div class="label text-black">Efecto superior o fin</div>
          <div class="nodo efecto-nodo ancho-central with-arrow-down">
            {{ resumen.efectoSuperior?.descripcion }}
          </div>
        </div>

        <!-- RESULTADOS -->
        <div class="nivel resultados" v-if="hayResultados">
          <div class="label text-black">Resultados</div>
          <div class="fila">
            <div
              v-for="(comp, idx) in resumen.disenio?.componentes || []"
              :key="'res-' + idx"
              class="componente-columna"
            >
              <div
                v-for="(res, rIdx) in comp.resultados"
                :key="'res-' + idx + '-' + rIdx"
                class="nodo resultado-nodo with-arrow-down"
              >
                {{ res }}
              </div>
            </div>
          </div>
        </div>

        <!-- PROBLEMA CENTRAL -->
        <div class="nivel problema">
          <div class="label text-black">Problema central</div>
          <div class="nodo problema-nodo ancho-central with-arrow-down with-arrow-up">
            {{ resumen.identificacion?.problemaCentral }}
          </div>
        </div>

        <!-- COMPONENTES Y ACCIONES -->
        <div class="nivel componentes" v-if="resumen.disenio?.componentes?.length">
          <div class="label text-black">Componentes y acciones</div>
          <div class="fila">
            <div
              v-for="(comp, idx) in resumen.disenio.componentes"
              :key="'comp-' + idx"
              class="componente-columna"
            >
              <!-- Componente -->
              <div class="nodo componente-nodo with-arrow-up with-arrow-down">
                {{ comp.nombre }}
              </div>

              <!-- Acciones -->
              <div
                v-for="(accion, aIdx) in comp.acciones"
                :key="'accion-' + idx + '-' + aIdx"
                class="nodo accion-nodo with-arrow-up"
              >
                {{ accion }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <q-card-actions align="right" class="q-mt-lg">
        <q-btn
          color="primary"
          icon="picture_as_pdf"
          label="Descargar PDF Anexo 4"
          @click="descargarPdfParte"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Notify } from 'quasar'
import api from 'src/boot/api'
import html2pdf from 'html2pdf.js'

const resumen = ref({
  identificacion: null,
  disenio: null,
  efectoSuperior: null,
})

const hayResultados = computed(() => {
  return resumen.value?.disenio?.componentes?.some((c) => c.resultados?.length) || false
})

async function cargarDatos() {
  try {
    const [identificacionRes, disenioRes, efectoRes] = await Promise.all([
      api.get('/IdentificacionDescripcionProblema/ultimo'),
      api.get('/DisenoIntervencionPublica/ultimo'),
      api.get('/EfectoSuperior/ultimo'),
    ])

    resumen.value = {
      identificacion: identificacionRes.data,
      disenio: disenioRes.data,
      efectoSuperior: efectoRes.data,
    }

    console.log('✅ Datos Anexo 4:', resumen.value)
  } catch (err) {
    console.error('❌ Error al cargar Anexo 4:', err)
    Notify.create({ type: 'negative', message: 'Error al cargar datos del Anexo 4' })
  }
}

function descargarPdfParte() {
  const el = document.querySelector('.q-card')
  if (!el) return
  html2pdf()
    .set({
      margin: 0.5,
      filename: 'anexo4_arbol_problemas.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    })
    .from(el)
    .save()
}

onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
.arbol-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
}
.label {
  font-weight: bold;
  margin-bottom: 8px;
  color: white;
  text-transform: uppercase;
}
.nivel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.fila {
  display: flex;
  flex-direction: row;
  gap: 40px;
  justify-content: center;
  flex-wrap: wrap;
}
.componente-columna {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.nodo {
  position: relative;
  padding: 10px 20px;
  border-radius: 6px;
  min-width: 180px;
  text-align: center;
  font-weight: bold;
}
.ancho-central {
  min-width: 400px;
}
.efecto-nodo,
.problema-nodo {
  background-color: #8a1538;
  color: white;
}
.resultado-nodo {
  background-color: #f59e0b;
  color: black;
}
.componente-nodo {
  background-color: #2563eb;
  color: white;
}
.accion-nodo {
  background-color: #10b981;
  color: white;
}

/* === Flechas con pseudo-elementos === */
</style>
