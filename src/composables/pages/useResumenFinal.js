import { userStorage } from 'src/utils/userStorage'
import { ref, onMounted } from 'vue'
import api from 'src/boot/api'

export function useResumenFinal() {
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

  async function descargarPdfParte(parte) {
    let el = null
    if (parte === 'parte1') el = parte1Ref.value?.$el || parte1Ref.value
    if (parte === 'parte2') el = parte2Ref.value?.$el || parte2Ref.value
    if (parte === 'parte3') el = parte3Ref.value?.$el || parte3Ref.value
    if (!el) return

    const { default: html2pdf } = await import('html2pdf.js')
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
    const { default: html2pdf } = await import('html2pdf.js')
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
      const tipo = userStorage.getItem('tipoAlineacion') || 'Municipio'
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
          ? api.get('/AlineacionEstado/ultimo').catch((e) => {
              if (e.response?.status !== 404) throw e
              return { data: null }
            })
          : api.get('/AlineacionMunicipio/ultimo').catch((e) => {
              if (e.response?.status !== 404) throw e
              return { data: null }
            }),
        api.get('/ClasificacionFuncional/ultimo').catch((e) => {
          if (e.response?.status !== 404) throw e
          return { data: null }
        }),
        api.get('/Antecedente/ultimo').catch((e) => {
          if (e.response?.status !== 404) throw e
          return { data: null }
        }),
        api.get('/IdentificacionDescripcionProblema/ultimo').catch((e) => {
          if (e.response?.status !== 404) throw e
          return { data: null }
        }),
        api.get('/DeterminacionJustificacionObjetivos/ultimo').catch((e) => {
          if (e.response?.status !== 404) throw e
          return { data: null }
        }),
        api.get('/Cobertura/ultimo').catch((e) => {
          if (e.response?.status !== 404) throw e
          return { data: null }
        }),
        api.get('/DisenoIntervencionPublica/ultimo').catch((e) => {
          if (e.response?.status !== 404) throw e
          return { data: null }
        }),
        api.get('/ProgramaSocial/ultimo').catch((e) => {
          if (e.response?.status !== 404) throw e
          return { data: null }
        }),
        api.get('/PadronBeneficiarios/ultimo').catch((e) => {
          if (e.response?.status !== 404) throw e
          return { data: null }
        }),
        api.get('/ReglasOperacion/ultimo').catch((e) => {
          if (e.response?.status !== 404) throw e
          return { data: null }
        }),
      ])

      resumen.value.alineacion = alineacionRes.data
      resumen.value.clasificacion = clasificacionRes.data
      resumen.value.antecedente = antecedenteRes.data
      resumen.value.identificacion = identificacionRes.data
      resumen.value.objetivos = objetivosRes.data
      resumen.value.cobertura = coberturaRes.data
      resumen.value.diseno = disenoRes.data
      resumen.value.programa = programaRes.data || null
      resumen.value.padron = padronRes.data || null
      resumen.value.reglas = reglasRes.data || null

      console.log('Programa:', programaRes.data)
      console.log('Padron:', padronRes.data)
      console.log('Reglas:', reglasRes.data)
    } catch (err) {
      console.error('Error al cargar resumen: ', err)
    }
  })
  return {
    parteActiva,
    resumen,
    parte1Ref,
    parte2Ref,
    parte3Ref,
    descargarPdfParte,
    descargarPdfCompleto,
  }
}
