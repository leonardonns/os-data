<template>
  <div class="tab-content">
    <h3>Pistão</h3>

    <GradeMedicao titulo="Folga dos Pinos de Pistão" :itens="itens6" v-model="d.folgaPinos" />
    <GradeMedicao titulo="Altura de Pistão" :itens="itens6" v-model="d.alturaPistao" />
    <GradeMedicao titulo="Diâmetro de Pino" :itens="itens6" v-model="d.diamPino" />
    <GradeMedicao titulo="Deslocamento de Pino" :itens="itens6" v-model="d.deslocamentoPino" />
    <GradeMedicao titulo="Diâmetro de Saia (10mm)" :itens="itens6" v-model="d.diamSaia" />

    <TabelaMedicao
      titulo="Largura das Canaletas"
      :colunas="['1ª Anel de Fogo', '2ª Anel Raspador', '3ª Anel do Óleo']"
      :linhas="linhas6"
      v-model="d.larguraCanaletas"
    />

    <TabelaMedicao
      titulo="Folga dos Anéis nas Canaletas"
      :colunas="['1° 0°', '1° 90°', '2° 0°', '2° 90°', '3° 0°', '3° 90°']"
      :linhas="linhas6"
      v-model="d.folgaAneisCanaletas"
    />

    <GradeMedicao titulo="Folga entre Pontas dos Anéis" :itens="itens6" v-model="d.folgaPontasAneis" />
  </div>
</template>

<script setup>
import GradeMedicao from './GradeMedicao.vue'
import TabelaMedicao from './TabelaMedicao.vue'

const props = defineProps({ modelValue: { type: Object, default: () => ({}) } })
const emit = defineEmits(['update:modelValue'])

const linhas6 = [1, 2, 3, 4, 5, 6]
const itens6 = ['1', '2', '3', '4', '5', '6']

const d = new Proxy({}, {
  get(_, prop) { return props.modelValue?.[prop] || '' },
  set(_, prop, value) {
    emit('update:modelValue', { ...props.modelValue, [prop]: value })
    return true
  }
})
</script>

<style scoped>
.tab-content h3 { margin: 0 0 16px; font-size: 18px; }
</style>
