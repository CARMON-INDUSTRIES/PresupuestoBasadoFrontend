<template>
  <div class="q-gutter-sm">
    <div class="text-subtitle1">Documentos de {{ usuario.userName }}</div>
    <div>Programa: {{ usuario.programaPresupuestario || 'Sin registrar' }}</div>
    <p class="text-caption">
      Se generan con los datos guardados actuales; no son copias históricas. Si faltan apartados, el
      PDF general se identifica como incompleto.
    </p>
    <q-select
      v-model="formato"
      :options="formatos"
      emit-value
      map-options
      label="Tipo de documento"
      :disable="descargando"
    />
    <q-btn
      label="Descargar formato"
      icon="download"
      color="primary"
      :loading="descargando"
      @click="descargarPdf(formato)"
    />
    <q-btn label="Descargar PDF general" outline :disable="descargando" @click="descargarTodos" />
    <div v-if="generado" role="status">
      Última descarga en esta visita: {{ fechaAdmin(generado) }}
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import { useResumenDownload } from 'src/router/useResumenDownload'
import { fechaAdmin } from 'src/services/admin'
const props = defineProps({ usuario: { type: Object, required: true } })
const emit = defineEmits(['guardado', 'ocupado'])
const generado = ref(null)
const formato = ref('FormatoAlineacion')
const formatos = [
  ['FormatoAlineacion', 'Alineación'],
  ['FormatoFichaDeInformacionBasica1', 'Información básica'],
  ['FormatoFichaDeInformacionBasica2', 'Reglas de operación y padrón'],
  ['FormatoDefinicionDelProblema', 'Definición del problema'],
  ['FormatoAnalisisDeInvolucrados', 'Análisis de involucrados'],
  ['FormatoArbolDeProblemas', 'Árbol de problemas'],
  ['FormatoArbolDeObjetivos', 'Árbol de objetivos'],
  ['FormatoAnalisisInvolucrados', 'Análisis de alternativas'],
  ['FormatoEstructuraAnalitica', 'Estructura analítica'],
  ['FormatoMatriz', 'Matriz de indicadores'],
  ['FormatoFichaFinal', 'Fichas técnicas y metas'],
].map(([value, label]) => ({ value, label }))
const { descargando, descargarPdf, descargarTodos } = useResumenDownload({
  usuarioId: props.usuario.id,
  usuarioNombre: props.usuario.userName,
  alDescargar: () => {
    generado.value = new Date().toISOString()
    emit('guardado')
  },
})
watch(descargando, (valor) => emit('ocupado', valor), { flush: 'sync' })
</script>
