<template>
  <q-page class="page-container">
    <div class="content-wrapper">
      <!-- HEADER -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Programa Social</h1>
          <p class="page-subtitle">
            Define si el programa pertenece al ámbito social y selecciona sus categorías
            correspondientes.
          </p>
        </div>
      </div>

      <!-- CARD PRINCIPAL -->
      <q-form @submit.prevent="guardarProgramaSocial">
        <q-card class="modern-card">
          <q-card-section>
            <div class="section-title">¿Es un programa social?</div>

            <q-option-group
              v-model="form.esProgramaSocial"
              :options="[
                { label: 'Sí', value: true },
                { label: 'No', value: false },
              ]"
              type="radio"
              inline
              color="primary"
              class="modern-radio"
            />
          </q-card-section>

          <!-- CATEGORÍAS -->
          <q-card-section v-if="form.esProgramaSocial">
            <div class="section-title q-mb-lg">Categorías del programa</div>

            <div class="categories-grid">
              <q-card
                v-for="cat in categorias"
                :key="cat.nombre"
                flat
                bordered
                class="category-card"
                :class="{ active: cat.seleccionado }"
              >
                <q-card-section>
                  <div class="row items-center justify-between">
                    <div class="category-title">
                      {{ cat.nombre }}
                    </div>

                    <q-toggle v-model="cat.seleccionado" color="primary" />
                  </div>

                  <transition name="fade">
                    <div v-if="cat.seleccionado" class="q-mt-md">
                      <q-option-group
                        v-model="cat.tipo"
                        :options="[
                          { label: 'Directo', value: 'Directo' },
                          { label: 'Indirecto', value: 'Indirecto' },
                        ]"
                        type="radio"
                        inline
                        color="primary"
                        class="modern-radio"
                      />
                    </div>
                  </transition>
                </q-card-section>
              </q-card>
            </div>
          </q-card-section>

          <!-- ACCIONES -->
          <q-card-actions align="right" class="q-pa-lg actions-container">
            <q-btn
              label="Pantalla anterior"
              class="secondary-btn"
              unelevated
              to="formulario-reglas-operacion-detalle"
            />

            <q-btn label="Continuar" type="submit" class="primary-btn" unelevated />
          </q-card-actions>
        </q-card>
      </q-form>
    </div>
  </q-page>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { Notify } from 'quasar'
import { useRouter } from 'vue-router'
import api from 'src/boot/api'

const STORAGE_KEY = 'formularioProgramaSocialCompleto'
const router = useRouter()

const form = ref({
  esProgramaSocial: null,
})

const categorias = ref([
  { nombre: 'Alimentación', tipo: '', seleccionado: false },
  { nombre: 'Educación', tipo: '', seleccionado: false },
  { nombre: 'Salud', tipo: '', seleccionado: false },
  { nombre: 'Trabajo', tipo: '', seleccionado: false },
  { nombre: 'Vivienda', tipo: '', seleccionado: false },
  { nombre: 'Seguridad social', tipo: '', seleccionado: false },
  { nombre: 'No discriminación', tipo: '', seleccionado: false },
  { nombre: 'Medio ambiente sano', tipo: '', seleccionado: false },
  { nombre: 'Bienestar económico', tipo: '', seleccionado: false },
])

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    const parsed = JSON.parse(saved)
    form.value = parsed.form ?? form.value
    categorias.value = parsed.categorias ?? categorias.value
    console.log('Datos cargados desde localStorage:', parsed)
  }
})

watch(
  [form, categorias],
  () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ form: form.value, categorias: categorias.value }),
    )
  },
  { deep: true },
)

async function guardarProgramaSocial() {
  try {
    const payload = {
      esProgramaSocial: form.value.esProgramaSocial,
      categorias: categorias.value
        .filter((cat) => cat.seleccionado)
        .map((cat) => ({
          nombre: cat.nombre,
          tipo: cat.tipo,
        })),
    }

    await api.post('/ProgramaSocial', payload)

    Notify.create({
      type: 'positive',
      message: 'Programa social guardado correctamente',
    })

    localStorage.setItem('ultimaRutaRegistro', '/formulario-padron-beneficiarios')
    router.push('/formulario-padron-beneficiarios')
  } catch (error) {
    console.error(error)
    Notify.create({
      type: 'negative',
      message: 'Error al guardar el programa social',
    })
  }
}
</script>

<style scoped>
.page-container {
  background: #f4f6f9;
  min-height: 100vh;
}

.content-wrapper {
  max-width: 1200px;
  margin: auto;
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: #691b31;
  margin: 0;
}

.page-subtitle {
  color: #6b7280;
  margin-top: 8px;
  font-size: 1rem;
}

.modern-card {
  border-radius: 24px;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.08);
  border: none;
  background: white;
}

.section-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #374151;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 18px;
}

.category-card {
  border-radius: 18px;
  border: 1px solid #e5e7eb;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
  background: #fff;
}

.category-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
}

.category-card.active {
  border-color: #c5a46d;
  background: #fffbf5;
}

.category-title {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}

.modern-radio {
  margin-top: 12px;
}

.primary-btn {
  background: #c5a46d;
  color: white;
  border-radius: 14px;
  padding: 12px 28px;
  font-weight: 700;
  font-size: 0.95rem;
}

.primary-btn:hover {
  opacity: 0.95;
}

.secondary-btn {
  background: #691b31;
  color: white;
  border-radius: 14px;
  padding: 12px 28px;
  font-weight: 700;
  font-size: 0.95rem;
}

.actions-container {
  gap: 12px;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.7rem;
  }

  .actions-container {
    flex-direction: column;
  }

  .primary-btn,
  .secondary-btn {
    width: 100%;
  }

  .categories-grid {
    grid-template-columns: 1fr;
  }
}
</style>
