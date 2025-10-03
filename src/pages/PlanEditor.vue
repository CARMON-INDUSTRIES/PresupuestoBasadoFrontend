<template>
  <div>
    <div v-for="(nivel1, i1) in modelValue" :key="i1" class="q-mb-md">
      <q-input v-model="nivel1.nombre" :label="`${nivel1Label} ${i1 + 1}`" filled class="q-mb-sm" />

      <!-- Nivel 2 -->
      <div v-for="(nivel2, i2) in nivel1.hijos" :key="i2" class="q-ml-md q-mb-sm">
        <q-input v-model="nivel2.nombre" :label="`${nivel2Label} ${i1 + 1}.${i2 + 1}`" filled />

        <!-- Nivel 3 -->
        <div v-for="(nivel3, i3) in nivel2.hijos" :key="i3" class="q-ml-md q-mb-sm">
          <q-input
            v-model="nivel3.nombre"
            :label="`${nivel3Label} ${i1 + 1}.${i2 + 1}.${i3 + 1}`"
            filled
          />

          <!-- Nivel 4 (opcional) -->
          <div v-if="nivel4Label">
            <div v-for="(nivel4, i4) in nivel3.hijos" :key="i4" class="q-ml-md q-mb-sm">
              <q-input
                v-model="nivel4.nombre"
                :label="`${nivel4Label} ${i1 + 1}.${i2 + 1}.${i3 + 1}.${i4 + 1}`"
                filled
              />
            </div>
            <q-btn
              flat
              color="primary"
              icon="add"
              label="Agregar {{ nivel4Label }}"
              @click="agregarHijo(nivel3)"
            />
          </div>
        </div>

        <q-btn
          flat
          color="secondary"
          icon="add"
          label="Agregar {{ nivel3Label }}"
          @click="agregarHijo(nivel2)"
        />
      </div>

      <q-btn
        flat
        color="accent"
        icon="add"
        label="Agregar {{ nivel2Label }}"
        @click="agregarHijo(nivel1)"
      />
    </div>

    <q-btn flat color="primary" icon="add" label="Agregar {{ nivel1Label }}" @click="agregarRaiz" />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: Array,
  nivel1: String,
  nivel2: String,
  nivel3: String,
  nivel4: String, // opcional
})
const emit = defineEmits(['update:modelValue'])

const nivel1Label = props.nivel1
const nivel2Label = props.nivel2
const nivel3Label = props.nivel3
const nivel4Label = props.nivel4

// Agregar un nivel raíz
function agregarRaiz() {
  const nuevo = [...props.modelValue, { nombre: '', hijos: [] }]
  emit('update:modelValue', nuevo)
}

// Agregar hijo a cualquier nivel
function agregarHijo(padre) {
  // clon profundo para evitar mutación directa
  const nuevoModel = JSON.parse(JSON.stringify(props.modelValue))
  const padreClon = buscarPadre(nuevoModel, padre)
  if (padreClon) {
    if (!padreClon.hijos) padreClon.hijos = []
    padreClon.hijos.push({ nombre: '', hijos: [] })
    emit('update:modelValue', nuevoModel)
  }
}

// buscar padre en clon (recursivo)
function buscarPadre(array, target) {
  for (let item of array) {
    if (item.nombre === target.nombre && item.hijos.length === target.hijos.length) return item
    if (item.hijos) {
      const encontrado = buscarPadre(item.hijos, target)
      if (encontrado) return encontrado
    }
  }
  return null
}
</script>
