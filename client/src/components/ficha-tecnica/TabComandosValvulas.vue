<template>
  <div class="tab-content">
    <h3>Comandos de Válvulas</h3>

    <div class="secao-titulo">Ponta Dianteira</div>
    <div class="grid2">
      <CampoMedida label="Concentricidade" unidade="mm" v-model="d.pontaDiantConcentricidade" />
      <CampoMedida label="Deslocamento" unidade="mm" v-model="d.pontaDiantDeslocamento" />
    </div>

    <div class="secao-titulo">Ponta Traseira</div>
    <div class="grid2">
      <CampoMedida label="Concentricidade" unidade="mm" v-model="d.pontaTrasConcentricidade" />
      <CampoMedida label="Deslocamento" unidade="mm" v-model="d.pontaTrasDeslocamento" />
    </div>

    <div class="grid2">
      <CampoMedida label="Magnetismo ADM" unidade="Gaus Meter" v-model="d.magnetismoAdm" />
      <CampoMedida label="Magnetismo ESC" unidade="Gaus Meter" v-model="d.magnetismoEsc" />
    </div>

    <CampoMedida label="Empenamento central (prisma)" unidade="mm" v-model="d.empenamentoCentral" />

    <GradeMedicao
      titulo="Dureza do Came - Admissão"
      :itens="itens8"
      v-model="d.durezaCameAdm"
    />

    <GradeMedicao
      titulo="Dureza do Came - Escape"
      :itens="itens8"
      v-model="d.durezaCameEsc"
    />

    <TabelaMedicao
      titulo="Diâmetro Munhão - Admissão"
      :colunas="['A 0°', 'B 90°', 'CON']"
      :linhas="linhas8"
      v-model="d.diamMunhaoAdm"
    />

    <TabelaMedicao
      titulo="Diâmetro Munhão - Escape"
      :colunas="['A 0°', 'B 90°', 'CON']"
      :linhas="linhas8"
      v-model="d.diamMunhaoEsc"
    />

    <div class="secao-titulo">Diagramação dos Cames</div>

    <TabelaMedicao
      titulo="ADM - Altura Came"
      :colunas="['Valor']"
      :linhas="linhas16"
      v-model="d.alturaCameAdm"
    />

    <TabelaMedicao
      titulo="ADM - Grau Came"
      :colunas="['Valor']"
      :linhas="linhas16"
      v-model="d.grauCameAdm"
    />

    <TabelaMedicao
      titulo="ESC - Altura Came"
      :colunas="['Valor']"
      :linhas="linhas16"
      v-model="d.alturaCameEsc"
    />

    <TabelaMedicao
      titulo="ESC - Grau Came"
      :colunas="['Valor']"
      :linhas="linhas16"
      v-model="d.grauCameEsc"
    />
  </div>
</template>

<script setup>
import CampoMedida from './CampoMedida.vue'
import GradeMedicao from './GradeMedicao.vue'
import TabelaMedicao from './TabelaMedicao.vue'

const props = defineProps({ modelValue: { type: Object, default: () => ({}) } })
const emit = defineEmits(['update:modelValue'])

const linhas8 = [1, 2, 3, 4, 5, 6, 7, 8]
const linhas16 = Array.from({ length: 16 }, (_, i) => i + 1)
const itens8 = ['1', '2', '3', '4', '5', '6', '7', '8']

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
.secao-titulo { font-weight: 700; font-size: 15px; margin: 16px 0 8px; }
.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 10px 0; }
@media (max-width: 700px) { .grid2 { grid-template-columns: 1fr; } }
</style>
