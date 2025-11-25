<template>
  <q-page padding class="bg-secondary">
    <q-card flat bordered class="q-pa-md">
      <q-card-section>
        <div class="text-h5">Alineación de la Matriz de Indicadores para Resultados</div>
      </q-card-section>

      <q-tabs v-model="parteActiva" class="text-primary">
        <q-tab name="parte1" label="Parte 1" />
        <q-tab name="parte2" label="Parte 2" />
        <q-tab name="parte3" label="Parte 3" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="parteActiva" animated>
        <q-tab-panel name="parte1">
          <q-card-section ref="parte1Ref">
            <div class="text-subtitle1">Datos del Usuario</div>
            <q-list dense>
              <q-item-label>Nombre Completo: Luis Ramon Hernandez Rodriguez</q-item-label>
              <q-item-label>Cargo: Director de Proyectos Especiales</q-item-label>
              <q-item-label>Coordinador: María López Hernández</q-item-label>
              <q-item-label
                >Unidad Responsable: {{ resumen.usuario.unidadResponsable }}</q-item-label
              >
              <q-item-label
                >Unidades Presupuestales: {{ resumen.usuario.unidadesPresupuestales }}</q-item-label
              >
              <q-item-label
                >Programa Presupuestario: {{ resumen.usuario.programaPresupuestario }}</q-item-label
              >
              <q-item-label>Nombre Matriz: {{ resumen.usuario.nombreMatriz }}</q-item-label>
            </q-list>

            <q-separator class="q-my-md" />

            <div class="text-subtitle1">Alineación {{ resumen.tipoAlineacion }}</div>
            <q-list dense>
              <q-item-label>Acuerdo: {{ resumen.alineacion?.acuerdo }}</q-item-label>
              <q-item-label>Objetivo: {{ resumen.alineacion?.objetivo }}</q-item-label>
              <q-item-label>Estrategia: {{ resumen.alineacion?.estrategia }}</q-item-label>
              <q-item-label>Línea de Acción: {{ resumen.alineacion?.lineaAccion }}</q-item-label>
              <q-item-label>Ramo: {{ resumen.alineacion?.ramo }}</q-item-label>
            </q-list>

            <q-separator class="q-my-md" />

            <div class="text-subtitle1">Clasificación Funcional</div>
            <q-list dense>
              <q-item-label>Finalidad: {{ resumen.clasificacion?.finalidad }}</q-item-label>
              <q-item-label>Función: {{ resumen.clasificacion?.funcion }}</q-item-label>
              <q-item-label>Subfunción: {{ resumen.clasificacion?.subfuncion }}</q-item-label>
              <q-item-label>Año Operando: {{ resumen.clasificacion?.anioOperando }}</q-item-label>
              <q-item-label
                >Entrega de Bienes: {{ resumen.clasificacion?.entregaBienes }}</q-item-label
              >
            </q-list>

            <q-card-actions align="right">
              <q-card-actions align="right">
                <q-btn
                  color="primary"
                  icon="picture_as_pdf"
                  label="Descargar PDF Parte 1"
                  @click="descargarPdfParte('parte1')"
                />
              </q-card-actions>
            </q-card-actions>
          </q-card-section>
        </q-tab-panel>

        <q-tab-panel name="parte2">
          <q-card-section ref="parte2Ref">
            <div class="text-subtitle1">Antecedente</div>
            <q-list dense>
              <q-item-label
                >Descripción: {{ resumen.antecedente?.descripcionPrograma }}</q-item-label
              >
              <q-item-label
                >Contexto Histórico:
                {{ resumen.antecedente?.contextoHistoricoNormativo }}</q-item-label
              >
              <q-item-label
                >Problemática: {{ resumen.antecedente?.problematicaOrigen }}</q-item-label
              >
              <q-item-label
                >Experiencias Previas: {{ resumen.antecedente?.experienciasPrevias }}</q-item-label
              >
            </q-list>

            <q-separator class="q-my-md" />

            <div class="text-subtitle1">Identificación del Problema</div>
            <q-list dense>
              <q-item-label
                >Problema Central: {{ resumen.identificacion?.problemaCentral }}</q-item-label
              >
              <q-item-label>Involucrados: {{ resumen.identificacion?.involucrados }}</q-item-label>
              <q-item-label>Causas: {{ resumen.identificacion?.causas }}</q-item-label>
              <q-item-label>Efectos: {{ resumen.identificacion?.efectos }}</q-item-label>
              <q-item-label>Evolución: {{ resumen.identificacion?.evolucion }}</q-item-label>
            </q-list>

            <q-separator class="q-my-md" />

            <div class="text-subtitle1">Objetivos</div>
            <q-list dense>
              <q-item-label
                >Objetivos Específicos: {{ resumen.objetivos?.objetivosEspecificos }}</q-item-label
              >
              <q-item-label
                >Relación con Otros Programas:
                {{ resumen.objetivos?.relacionOtrosProgramas }}</q-item-label
              >
            </q-list>

            <q-separator class="q-my-md" />

            <div class="text-subtitle1">Cobertura</div>
            <q-list dense>
              <q-item-label
                >Población Potencial:
                {{
                  resumen.cobertura?.identificacionCaracterizacionPoblacionPotencial
                }}</q-item-label
              >
              <q-item-label
                >Población Objetivo:
                {{
                  resumen.cobertura?.identificacionCaracterizacionPoblacionObjetivo
                }}</q-item-label
              >
            </q-list>

            <q-separator class="q-my-md" />

            <div class="text-subtitle1">Diseño de la Intervención Pública</div>
            <div v-if="resumen.diseno?.componentes?.length">
              <div
                v-for="(comp, idx) in resumen.diseno.componentes"
                :key="idx"
                class="q-pa-sm q-mb-sm bg-grey-2 rounded-borders"
              >
                <div class="text-subtitle2">{{ comp.nombre || `Componente ${idx + 1}` }}</div>
                <div><strong>Acciones:</strong></div>
                <ul>
                  <li v-for="(a, i) in comp.acciones" :key="'a' + i">{{ a }}</li>
                </ul>
                <div><strong>Resultados:</strong></div>
                <ul>
                  <li v-for="(r, i) in comp.resultados" :key="'r' + i">{{ r }}</li>
                </ul>
              </div>
            </div>

            <q-card-actions align="right">
              <q-btn
                color="primary"
                icon="picture_as_pdf"
                label="Descargar PDF Parte 2"
                @click="descargarPdfParte('parte2')"
              />
            </q-card-actions>
          </q-card-section>
        </q-tab-panel>

        <q-tab-panel name="parte3">
          <q-card-section ref="parte3">
            <div class="text-subtitle1">Programa Social</div>
            <q-list dense>
              <q-item-label
                >¿Es Programa Social?:
                {{ resumen.programa?.esProgramaSocial ? 'Sí' : 'No' }}</q-item-label
              >
              <q-item-label>
                Categorías:
                <span v-if="resumen.programa?.categorias?.length">
                  <ul>
                    <li v-for="(cat, idx) in resumen.programa.categorias" :key="idx">
                      {{ cat.nombre || JSON.stringify(cat) }}
                    </li>
                  </ul>
                </span>
                <span v-else>-</span>
              </q-item-label>
            </q-list>

            <q-separator class="q-my-md" />

            <div class="text-subtitle1">Padrón de Beneficiarios</div>
            <q-list dense>
              <q-item-label
                >¿Tiene Padrón?: {{ resumen.padron?.tienePadron ? 'Sí' : 'No' }}</q-item-label
              >
              <q-item-label
                >Archivo Adjunto: {{ resumen.padron?.archivoAdjunto || 'N/A' }}</q-item-label
              >
              <q-item-label>
                Liga Internet:
                <a
                  v-if="resumen.padron?.ligaInternet"
                  :href="resumen.padron.ligaInternet"
                  target="_blank"
                >
                  {{ resumen.padron.ligaInternet }}
                </a>
                <span v-else>-</span>
              </q-item-label>
            </q-list>

            <q-separator class="q-my-md" />

            <div class="text-subtitle1">Reglas de Operación</div>
            <q-list dense>
              <q-item-label
                >¿Tiene Reglas?:
                {{ resumen.reglas?.tieneReglasOperacion ? 'Sí' : 'No' }}</q-item-label
              >
              <q-item-label
                >Archivo Adjunto: {{ resumen.reglas?.archivoAdjunto || 'N/A' }}</q-item-label
              >
              <q-item-label>
                Liga Internet:
                <a
                  v-if="resumen.reglas?.ligaInternet"
                  :href="resumen.reglas.ligaInternet"
                  target="_blank"
                >
                  {{ resumen.reglas.ligaInternet }}
                </a>
                <span v-else>-</span>
              </q-item-label>
            </q-list>

            <q-card-actions align="right">
              <q-btn
                color="primary"
                icon="picture_as_pdf"
                label="Descargar PDF Parte 3"
                @click="descargarPdfParte('parte3')"
              />
            </q-card-actions>
          </q-card-section>
        </q-tab-panel>
      </q-tab-panels>

      <q-card-actions align="right" class="q-mt-md">
        <q-btn
          color="deep-orange"
          icon="picture_as_pdf"
          label="Descargar TODO en PDF"
          @click="descargarPdfCompleto"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from 'src/boot/api'
import html2pdf from 'html2pdf.js'

const parteActiva = ref('parte1')
const resumen = ref({
  usuario: {},
  alineacion: null,
  clasificacion: null,
  antecedente: null,
  identificacion: null,
  objetivos: null,
  cobertura: null,
  diseno: null,
  programa: null,
  padron: null,
  reglas: null,
})

const parte1Ref = ref(null)
const parte2Ref = ref(null)
const parte3Ref = ref(null)

function descargarPdfParte(parte) {
  let el = null
  if (parte === 'parte1') el = parte1Ref.value?.$el || parte1Ref.value
  if (parte === 'parte2') el = parte2Ref.value?.$el || parte2Ref.value
  if (parte === 'parte3') el = parte3Ref.value?.$el || parte3Ref.value
  if (!el) return

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

async function descargarPdfCompleto() {
  const el = document.querySelector('.q-card')
  html2pdf()
    .set({
      margin: 0.5,
      filename: `resumen_completo.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    })
    .from(el)
    .save()
}

onMounted(async () => {
  try {
    const tipo = localStorage.getItem('tipoAlineacion') || 'Municipio'
    resumen.value.tipoAlineacion = tipo

    const [
      alineacionRes,
      clasificacionRes,
      antecedenteRes,
      identificacionRes,
      objetivosRes,
      coberturaRes,
      disenoRes,
      programaRes,
      padronRes,
      reglasRes,
    ] = await Promise.all([
      tipo === 'Estado'
        ? api.get('/AlineacionEstado/ultimo')
        : api.get('/AlineacionMunicipio/ultimo'),
      api.get('/ClasificacionFuncional/ultimo'),
      api.get('/Antecedente/ultimo'),
      api.get('/IdentificacionDescripcionProblema/ultimo'),
      api.get('/DeterminacionJustificacionObjetivos/ultimo'),
      api.get('/Cobertura/ultimo'),
      api.get('/DisenoIntervencionPublica/ultimo'),
      api.get('/ProgramaSocial/ultimo'),
      api.get('/PadronBeneficiarios/ultimo'),
      api.get('/ReglasOperacion/ultimo'),
    ])

    resumen.value.alineacion = alineacionRes.data
    resumen.value.clasificacion = clasificacionRes.data
    resumen.value.antecedente = antecedenteRes.data
    resumen.value.identificacion = identificacionRes.data
    resumen.value.objetivos = objetivosRes.data
    resumen.value.cobertura = coberturaRes.data
    resumen.value.diseno = disenoRes.data
    resumen.value.programa = programaRes.data[0] || null
    resumen.value.padron = padronRes.data[0] || null
    resumen.value.reglas = reglasRes.data[0] || null

    console.log('Programa:', programaRes.data)
    console.log('Padron:', padronRes.data)
    console.log('Reglas:', reglasRes.data)
  } catch (err) {
    console.error('❌ Error al cargar resumen:', err)
  }
})
</script>
