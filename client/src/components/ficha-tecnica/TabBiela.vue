<template>
  <div class="tab-content">
    <h3>Biela</h3>

    <GradeMedicao titulo="Peso" :itens="itens6" v-model="d.peso" />
    <GradeMedicao titulo="Magnetismo (Gaus Meter)" :itens="itens6" v-model="d.magnetismo" />
    <GradeMedicao titulo="Torção (Contraste)" :itens="itens6" v-model="d.torcao" />
    <GradeMedicao titulo="Deslocamento Bucha" :itens="itens6" v-model="d.deslocamentoBucha" />

    <TabelaMedicao
      titulo="Diâmetro Bucha Biela"
      :colunas="['0°', '45°', '90°', '180°', '225°', '270°', '315°']"
      :linhas="linhas6"
      v-model="d.diamBuchaBiela"
    />

    <TabelaMedicao
      titulo="Diâmetro Alojamento"
      :colunas="colsAngulos"
      :linhas="linhas6"
      v-model="d.diamAlojamento"
    />
  </div>
</template>

<script setup>
import GradeMedicao from './GradeMedicao.vue'
import TabelaMedicao from './TabelaMedicao.vue'

const props = defineProps({ modelValue: { type: Object, default: () => ({}) } })
const emit = defineEmits(['update:modelValue'])

const linhas6 = [1, 2, 3, 4, 5, 6]
const itens6 = ['1', '2', '3', '4', '5', '6']
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
</style>
