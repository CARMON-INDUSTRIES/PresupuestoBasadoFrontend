<template>
  <q-page padding style="background-color: #691b31">
    <q-card flat bordered class="q-pa-md" style="max-width: 1100px; margin: auto">
      <q-card-section>
        <div class="text-h5 text-center">Resúmenes Generales</div>
      </q-card-section>

      <q-separator class="q-my-md" />

      <q-list bordered class="rounded-borders">
        <!-- FORMATO 1 -->
        <q-expansion-item icon="person" label="Formato 1 - Datos generales" expand-separator>
          <q-card id="formato1">
            <!-- 👈 id agregado -->
            <q-card-section>
              <div class="text-subtitle2 q-mb-sm">Datos del usuario</div>
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

              <div class="text-subtitle2 q-mt-md q-mb-sm">Alineación</div>
              <q-item-label>{{ resumen.alineacion?.descripcion }}</q-item-label>

              <div class="text-subtitle2 q-mt-md q-mb-sm">Clasificación Funcional</div>
              <q-item-label>{{ resumen.clasificacion?.descripcion }}</q-item-label>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn
                color="primary"
                icon="picture_as_pdf"
                label="Descargar PDF Formato 1"
                @click="descargarParte('formato1')"
              />
            </q-card-actions>
          </q-card>
        </q-expansion-item>

        <!-- ANEXO 1 -->
        <q-expansion-item icon="description" label="Anexo 1" expand-separator>
          <q-card id="anexo1">
            <!-- 👈 id agregado -->
            <q-card-section>
              <div class="text-subtitle2">Antecedentes</div>
              <q-item-label>{{ resumen.antecedente?.descripcionPrograma }}</q-item-label>

              <div class="text-subtitle2 q-mt-md">Identificación y descripción del problema</div>
              <q-item-label>{{ resumen.identificacion?.problemaCentral }}</q-item-label>

              <div class="text-subtitle2 q-mt-md">Determinación y justificación de objetivos</div>
              <q-item-label>{{ resumen.objetivos?.objetivosEspecificos }}</q-item-label>

              <div class="text-subtitle2 q-mt-md">Cobertura</div>
              <q-item-label>{{
                resumen.cobertura?.identificacionCaracterizacionPoblacionObjetivo
              }}</q-item-label>

              <div class="text-subtitle2 q-mt-md">Diseño de la intervención pública</div>
              <q-item-label>{{ resumen.disenio?.etapasIntervencion }}</q-item-label>

              <div class="text-subtitle2 q-mt-md">Programa Social</div>
              <q-item-label>{{ resumen.programa?.nombre }}</q-item-label>

              <div class="text-subtitle2 q-mt-md">Padrón de Beneficiarios</div>
              <q-item-label>{{ resumen.padron?.descripcion }}</q-item-label>

              <div class="text-subtitle2 q-mt-md">Reglas de operación</div>
              <q-item-label>{{ resumen.reglas?.ligaInternet }}</q-item-label>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn
                color="primary"
                icon="picture_as_pdf"
                label="Descargar PDF Anexo 1"
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
        >
          <q-card id="anexo2">
            <!-- 👈 id agregado -->
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
                icon="picture_as_pdf"
                label="Descargar PDF Anexo 2"
                @click="descargarParte('anexo2')"
              />
            </q-card-actions>
          </q-card>
        </q-expansion-item>

        <!-- ANEXO 3 -->
        <q-expansion-item icon="groups" label="Anexo 3 - Análisis de Involucrados" expand-separator>
          <q-card id="anexo3">
            <!-- 👈 id agregado -->
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
                icon="picture_as_pdf"
                label="Descargar PDF Anexo 3"
                @click="descargarParte('anexo3')"
              />
            </q-card-actions>
          </q-card>
        </q-expansion-item>
      </q-list>

      <q-separator class="q-my-lg" />

      <!-- BOTÓN GENERAL -->
      <q-card-actions align="center">
        <q-btn
          color="deep-orange"
          icon="picture_as_pdf"
          label="Descargar TODO en PDF"
          @click="descargarTodo"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Notify } from 'quasar'
import api from 'src/boot/api'
import html2pdf from 'html2pdf.js'

const resumen = ref({
  usuario: null,
  alineacion: null,
  clasificacion: null,
  antecedente: null,
  identificacion: null,
  objetivos: null,
  cobertura: null,
  disenio: null,
  programa: null,
  padron: null,
  reglas: null,
  efectoSuperior: null,
  tipoAlineacion: '', // 👈 guardamos Estado o Municipio
})

// Cargar todos los datos desde endpoints /ultimo
onMounted(async () => {
  try {
    const tipo = localStorage.getItem('tipoAlineacion') || 'Municipio'
    resumen.value.tipoAlineacion = tipo

    const alineacionEndpoint =
      tipo === 'Estado' ? '/AlineacionEstado/ultimo' : '/AlineacionMunicipio/ultimo'

    const [
      usuarioRes,
      alineacionRes,
      clasificacionRes,
      antecedenteRes,
      identificacionRes,
      objetivosRes,
      coberturaRes,
      disenioRes,
      programaRes,
      padronRes,
      reglasRes,
      efectoRes,
    ] = await Promise.all([
      api.get('/Cuentas/me'),
      api.get(alineacionEndpoint),
      api.get('/ClasificacionFuncional/ultimo'),
      api.get('/Antecedente/ultimo'),
      api.get('/IdentificacionDescripcionProblema/ultimo'),
      api.get('/DeterminacionJustificacionObjetivos/ultimo'),
      api.get('/Cobertura/ultimo'),
      api.get('/DisenoIntervencionPublica/ultimo'),
      api.get('/ProgramaSocial/ultimo'),
      api.get('/PadronBeneficiarios/ultimo'),
      api.get('/ReglasOperacion/ultimo'),
      api.get('/EfectoSuperior/ultimo'),
    ])

    resumen.value = {
      usuario: usuarioRes.data,
      alineacion: alineacionRes.data,
      clasificacion: clasificacionRes.data,
      antecedente: antecedenteRes.data,
      identificacion: identificacionRes.data,
      objetivos: objetivosRes.data,
      cobertura: coberturaRes.data,
      disenio: disenioRes.data,
      programa: programaRes.data,
      padron: padronRes.data,
      reglas: reglasRes.data,
      efectoSuperior: efectoRes.data,
      tipoAlineacion: tipo,
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
