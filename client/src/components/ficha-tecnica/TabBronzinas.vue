<template>
  <div class="tab-content">
    <h3>Bronzinas</h3>

    <div class="secao-titulo">Alojamento Mancal com Bronzina</div>
    <CampoMedida label="Base - Diâmetro do Munhão" v-model="d.baseDiamMunhao" />

    <TabelaMedicao
      titulo="Alojamento Mancal com Bronzina"
      :colunas="colsAngulos"
      :linhas="linhas6"
      v-model="d.alojMancalBronzina"
    />

    <div class="secao-titulo">Diâmetro Alojamento Biela com Bronzina</div>
    <CampoMedida label="Base - Diâmetro do Moente" v-model="d.baseDiamMoente" />

    <TabelaMedicao
      titulo="Diâmetro Alojamento Biela com Bronzina"
      :colunas="colsAngulos"
      :linhas="linhas6"
      v-model="d.diamAlojBielaBronzina"
    />
  </div>
</template>

<script setup>
import CampoMedida from './CampoMedida.vue'
import TabelaMedicao from './TabelaMedicao.vue'

const props = defineProps({ modelValue: { type: Object, default: () => ({}) } })
const emit = defineEmits(['update:modelValue'])

const linhas6 = [1, 2, 3, 4, 5, 6]
const colsAngulos = ['0°A', '0°B', '45°A', '45°B', '85°A', '85°B', '135°A', '135°B', '180°A', '180°B', '225°A', '225°B', '265°A', '265°B', '315°A', '315°B']

const d = new Proxy(props.modelValue, {
  get(target, prop) { return target[prop] || '' },
  set(target, prop, value) {
    emit('update:modelValue', { ...props.modelValue, [prop]: value })
    return true
  }
})
</script>

<style scoped>
.tab-content h3 { margin: 0 0 16px; font-size: 18px; }
.secao-titulo { font-weight: 700; font-size: 15px; margin: 16px 0 8px; }
</style>
