<template>
  <q-page padding class="resumen-page" style="background-color: #691b31">
    <q-card flat bordered class="resumen-card q-pa-lg">
      <q-card-section>
        <div class="text-h4 text-center text-primary q-mb-md">Resúmenes Generales</div>
      </q-card-section>

      <q-separator spaced />

      <q-list class="rounded-borders shadow-2 q-pa-sm">
        <!-- FORMATO 1 -->
        <q-expansion-item
          icon="person_outline"
          label="Formato 1 - Datos generales"
          expand-separator
          class="expansion-card"
        >
          <q-card flat bordered class="q-ma-sm formato-card">
            <q-card-section>
              <div class="text-subtitle1 text-bold q-mb-sm">Datos del usuario</div>
              <q-item-label>Nombre completo: {{ resumen.usuario?.nombreCompleto }}</q-item-label>
              <q-item-label>Cargo: {{ resumen.usuario?.cargo }}</q-item-label>
              <q-item-label>Coordinador: {{ resumen.usuario?.coordinador }}</q-item-label>
              <q-item-label
                >Unidades Presupuestales:
                {{ resumen.usuario?.unidadesPresupuestales }}</q-item-label
              >
              <q-item-label
                >Programa Presupuestario:
                {{ resumen.usuario?.programaPresupuestario }}</q-item-label
              >
              <q-item-label>Nombre Matriz: {{ resumen.usuario?.nombreMatriz }}</q-item-label>

              <div class="text-subtitle1 text-bold q-mt-md q-mb-sm">Alineación</div>
              <q-item-label>{{ resumen.alineacion?.descripcion }}</q-item-label>

              <div class="text-subtitle1 text-bold q-mt-md q-mb-sm">Clasificación Funcional</div>
              <q-item-label>{{ resumen.clasificacion?.descripcion }}</q-item-label>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn
                color="primary"
                dense
                rounded
                icon="picture_as_pdf"
                label="Descargar PDF"
                @click="descargarParte('formato1')"
              />
            </q-card-actions>
          </q-card>
        </q-expansion-item>

        <!-- ANEXO 1 -->
        <q-expansion-item
          icon="description"
          label="Anexo 1 - Antecedentes"
          expand-separator
          class="expansion-card"
        >
          <q-card flat bordered class="q-ma-sm formato-card">
            <q-card-section>
              <div class="text-subtitle1 text-bold q-mb-sm">Antecedentes</div>
              <q-item-label>{{ resumen.antecedente?.descripcionPrograma }}</q-item-label>

              <div class="text-subtitle1 text-bold q-mt-md q-mb-sm">Problema y objetivos</div>
              <q-item-label
                >Problema central: {{ resumen.identificacion?.problemaCentral }}</q-item-label
              >
              <q-item-label
                >Objetivos específicos: {{ resumen.objetivos?.objetivosEspecificos }}</q-item-label
              >

              <div class="text-subtitle1 text-bold q-mt-md q-mb-sm">Cobertura</div>
              <q-item-label>{{
                resumen.cobertura?.identificacionCaracterizacionPoblacionObjetivo
              }}</q-item-label>

              <div class="text-subtitle1 text-bold q-mt-md q-mb-sm">Programa Social</div>
              <q-item-label>{{ resumen.programa?.nombre }}</q-item-label>
              <q-item-label
                >Padrón de beneficiarios: {{ resumen.padron?.descripcion }}</q-item-label
              >
              <q-item-label>Reglas de operación: {{ resumen.reglas?.ligaInternet }}</q-item-label>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn
                color="primary"
                dense
                rounded
                icon="picture_as_pdf"
                label="Descargar PDF"
                @click="descargarParte('anexo1')"
              />
            </q-card-actions>
          </q-card>
        </q-expansion-item>

        <!-- ANEXO 2 -->
        <q-expansion-item
          icon="analytics"
          label="Anexo 2 - Definición del problema"
          expand-separator
          class="expansion-card"
        >
          <q-card flat bordered class="q-ma-sm formato-card">
            <q-card-section>
              <q-item-label
                >Problema central: {{ resumen.identificacion?.problemaCentral }}</q-item-label
              >
              <q-item-label>Magnitud: {{ resumen.identificacion?.evolucion }}</q-item-label>
              <q-item-label
                >Población potencial:
                {{
                  resumen.cobertura?.identificacionCaracterizacionPoblacionPotencial
                }}</q-item-label
              >
              <q-item-label
                >Población objetivo:
                {{
                  resumen.cobertura?.identificacionCaracterizacionPoblacionObjetivo
                }}</q-item-label
              >
              <q-item-label
                >Atendida anterior: {{ resumen.cobertura?.poblacionAtendidaAnterior }}</q-item-label
              >
              <q-item-label
                >Efecto superior: {{ resumen.efectoSuperior?.descripcion }}</q-item-label
              >
            </q-card-section>

            <q-card-actions align="right">
              <q-btn
                color="primary"
                dense
                rounded
                icon="picture_as_pdf"
                label="Descargar PDF"
                @click="descargarParte('anexo2')"
              />
            </q-card-actions>
          </q-card>
        </q-expansion-item>

        <!-- ANEXO 3 -->
        <q-expansion-item
          icon="groups"
          label="Anexo 3 - Análisis de Involucrados"
          expand-separator
          class="expansion-card"
        >
          <q-card flat bordered class="q-ma-sm formato-card">
            <q-card-section>
              <q-item-label
                >Problemática Central: {{ resumen.identificacion?.problemaCentral }}</q-item-label
              >
              <q-item-label
                >Beneficiarios: {{ resumen.identificacion?.beneficiarios }}</q-item-label
              >
              <q-item-label>Opositores: {{ resumen.identificacion?.opositores }}</q-item-label>
              <q-item-label>Ejecutores: {{ resumen.identificacion?.ejecutores }}</q-item-label>
              <q-item-label>Indiferentes: {{ resumen.identificacion?.indiferentes }}</q-item-label>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn
                color="primary"
                dense
                rounded
                icon="picture_as_pdf"
                label="Descargar PDF"
                @click="descargarParte('anexo3')"
              />
            </q-card-actions>
          </q-card>
        </q-expansion-item>
      </q-list>

      <q-separator spaced class="q-my-lg" />

      <!-- BOTÓN GENERAL -->
      <q-card-actions align="center">
        <q-btn
          color="deep-orange"
          rounded
          icon="picture_as_pdf"
          label="Descargar TODO en PDF"
          @click="descargarTodo"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<style scoped>
.resumen-page {
  background-color: #f4f4f4;
  display: flex;
  justify-content: center;
  padding-top: 20px;
}

.resumen-card {
  max-width: 1100px;
  width: 100%;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.expansion-card {
  transition: transform 0.2s;
}

.expansion-card:hover {
  transform: translateY(-2px);
}

.formato-card {
  background-color: #fafafa;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}
</style>

<script setup>
import { ref, onMounted } from 'vue'
import { Notify } from 'quasar'
import api from 'src/boot/api'
import html2pdf from 'html2pdf.js'

const resumen = ref({
  formatoInvolucrados: null,
  arbolObjetivos: null,
  definicionProblema: null,
  fichaBasica: null,
  arbolProblemas: null,
  matriz: null,
  estructuraAnalitica: null,
  alineacion: null,
})

// Cargar todos los datos desde endpoints /ultimo
onMounted(async () => {
  try {
    const [
      involucradosRes,
      arbolObjetivosRes,
      definicionProblemaRes,
      fichaBasicaRes,
      arbolProblemasRes,
      matrizRes,
      estructuraAnaliticaRes,
      alineacionRes,
    ] = await Promise.all([
      api.get('/FormatoAnalisisInvolucrados/ultimo'),
      api.get('/FormatoArbolDeObjetivos/ultimo'),
      api.get('/FormatoDefinicionDelProblema/ultimo'),
      api.get('/FormatoFichaDeInformacionBasica2/ultimo'),
      api.get('/FormatoArbolDeProblemas/ultimo'),
      api.get('/FormatoMatriz/ultimo'),
      api.get('/FormatoEstructuraAnalitica/ultimo'),
      api.get('/FormatoAlineacion/ultimo'),
    ])

    resumen.value = {
      formatoInvolucrados: involucradosRes.data,
      arbolObjetivos: arbolObjetivosRes.data,
      definicionProblema: definicionProblemaRes.data,
      fichaBasica: fichaBasicaRes.data,
      arbolProblemas: arbolProblemasRes.data,
      matriz: matrizRes.data,
      estructuraAnalitica: estructuraAnaliticaRes.data,
      alineacion: alineacionRes.data,
    }
  } catch (error) {
    console.error('❌ Error al cargar resúmenes:', error)
    Notify.create({
      type: 'negative',
      message: 'Error al cargar los resúmenes',
    })
  }
})

function descargarParte(parte) {
  const el = document.querySelector(`#${parte}`)
  if (!el) {
    Notify.create({ type: 'negative', message: `No se encontró la sección ${parte}` })
    return
  }

  html2pdf()
    .set({
      margin: 0.5,
      filename: `${parte}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    })
    .from(el)
    .save()
}

function descargarTodo() {
  const el = document.querySelector('.q-card') // toda la tarjeta
  if (!el) {
    Notify.create({ type: 'negative', message: 'No se encontró el resumen completo' })
    return
  }

  html2pdf()
    .set({
      margin: 0.5,
      filename: `resumenes_completo.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    })
    .from(el)
    .save()
}
</script>

<style scoped>
.q-page {
  display: flex;
  justify-content: center;
}
</style>
