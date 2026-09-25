<template>
  <q-form @submit.prevent="guardarDetalle">
    <q-card class="modern-card">
      <q-card-section>
        <div class="section-title">¿Es un programa social?</div>
        <p class="page-subtitle">
          Selecciona las características que aplican al programa presupuestario.
        </p>
      </q-card-section>

      <q-card-section class="form-grid">
        <div class="option-card">
          <div class="option-title">
            <q-icon name="gavel" color="primary" size="24px" />
            Sujeto a reglas de operación
          </div>

          <div class="option-description">
            Programas sujetos a lineamientos específicos y reglas de operación oficiales.
          </div>

          <q-option-group
            v-model="form.SujetoReglasOperacion"
            :options="opcionesSiNo"
            type="radio"
            inline
            color="primary"
            class="modern-radio"
          />
        </div>

        <div class="option-card">
          <div class="option-title">
            <q-icon name="volunteer_activism" color="primary" size="24px" />
            Otros subsidios
          </div>

          <div class="option-description">
            Subsidios otorgados mediante convenios y no sujetos a reglas de operación.
          </div>

          <q-option-group
            v-model="form.OtrosSubsidios"
            :options="opcionesSiNo"
            type="radio"
            inline
            color="primary"
            class="modern-radio"
          />
        </div>

        <div class="option-card">
          <div class="option-title">
            <q-icon name="miscellaneous_services" color="primary" size="24px" />
            Prestación de servicios públicos
          </div>

          <div class="option-description">
            Actividades realizadas para satisfacer demandas de la sociedad.
          </div>

          <q-option-group
            v-model="form.PrestacionServiciosPublicos"
            :options="opcionesSiNo"
            type="radio"
            inline
            color="primary"
            class="modern-radio"
          />
        </div>

        <div class="option-card">
          <div class="option-title">
            <q-icon name="inventory_2" color="primary" size="24px" />
            Provisión de bienes públicos
          </div>

          <div class="option-description">
            Actividades enfocadas en crear o elaborar bienes públicos.
          </div>

          <q-option-group
            v-model="form.ProvisionBienesPublicos"
            :options="opcionesSiNo"
            type="radio"
            inline
            color="primary"
            class="modern-radio"
          />
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-lg actions-container">
        <q-btn
          label="Pantalla anterior"
          class="secondary-btn"
          unelevated
          to="formulario-diseno-intervencion"
          :loading="saving"
        />

        <q-btn label="Continuar" type="submit" class="primary-btn" unelevated :loading="saving" />
      </q-card-actions>
    </q-card>
  </q-form>
</template>
<script>
import { inject } from 'vue'

export default {
  setup() {
    return inject('FormularioReglasOperacionDetalle')
  },
}
</script>
<style scoped src="src/css/pages/FormularioReglasOperacionDetalle.css" />
