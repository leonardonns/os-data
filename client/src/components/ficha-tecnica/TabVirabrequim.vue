<template>
  <div class="tab-content">
    <h3>Virabrequim</h3>

    <GradeMedicao titulo="Dureza Munhão" :itens="itens6" v-model="d.durezaMunhao" />
    <GradeMedicao titulo="Dureza Moente" :itens="itens6" v-model="d.durezaMoente" />
    <GradeMedicao titulo="Magnetismo Munhão (Gaus Meter)" :itens="itens6" v-model="d.magnetismoMunhao" />
    <GradeMedicao titulo="Magnetismo Moente (Gaus Meter)" :itens="itens6" v-model="d.magnetismoMoente" />
    <GradeMedicao titulo="Raio Concordância" :itens="itens6" v-model="d.raioConcordancia" />

    <CampoMedida label="Cubo Volante" unidade="mm" v-model="d.cuboVolante" />
    <CampoMedida label="Área Retentor" v-model="d.areaRetentor" />

    <CampoCheck label="Área da Chaveta" v-model="d.areaChaveta" />
    <CampoCheck label="Folga Axial Virabrequim" v-model="d.folgaAxial" />

    <div class="secao-titulo">Ponta Dianteira</div>
    <div class="grid3">
      <CampoMedida label="Deslocamento" unidade="mm" v-model="d.pontaDiantDeslocamento" />
      <CampoMedida label="Concentricidade" unidade="mm" v-model="d.pontaDiantConcentricidade" />
      <CampoMedida label="Área Retentor" unidade="mm" v-model="d.pontaDiantAreaRetentor" />
    </div>

    <div class="secao-titulo">Ponta Traseira</div>
    <div class="grid3">
      <CampoMedida label="Deslocamento" unidade="mm" v-model="d.pontaTrasDeslocamento" />
      <CampoMedida label="Concentricidade" unidade="mm" v-model="d.pontaTrasConcentricidade" />
      <CampoMedida label="Área Retentor" unidade="mm" v-model="d.pontaTrasAreaRetentor" />
    </div>

    <CampoCheck label="Balanceamento" v-model="d.balanceamento" />

    <TabelaMedicao
      titulo="Diâmetro Moentes"
      :colunas="colsMoentes"
      :linhas="linhas6"
      v-model="d.diamMoentes"
    />

    <TabelaMedicao
      titulo="Diâmetro Munhões"
      :colunas="colsMoentes"
      :linhas="linhas6"
      v-model="d.diamMunhoes"
    />
  </div>
</template>

<script setup>
import CampoCheck from './CampoCheck.vue'
import CampoMedida from './CampoMedida.vue'
import GradeMedicao from './GradeMedicao.vue'
import TabelaMedicao from './TabelaMedicao.vue'

const props = defineProps({ modelValue: { type: Object, default: () => ({}) } })
const emit = defineEmits(['update:modelValue'])

const linhas6 = [1, 2, 3, 4, 5, 6]
const itens6 = ['1', '2', '3', '4', '5', '6']

const colsMoentes = ['A 0°', 'B 0°', 'C 0°', 'A 90°', 'B 90°', 'C 90°', 'CON']

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
.grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin: 10px 0; }
@media (max-width: 700px) { .grid3 { grid-template-columns: 1fr; } }
</style>
