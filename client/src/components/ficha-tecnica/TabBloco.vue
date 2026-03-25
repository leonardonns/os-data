<template>
  <div class="tab-content">
    <h3>Bloco</h3>

    <TabelaMedicao
      titulo="Altura do Bloco"
      :colunas="['1 mm', '2 mm', '3 mm', '4 mm']"
      :linhas="['Total', 'Prisma', 'Mancal']"
      v-model="d.alturaBloco"
    />

    <CampoCheck label="Planicidade superior" v-model="d.planicidadeSuperior" />
    <CampoCheck label="Limpeza das galerias" v-model="d.limpezaGalerias" />
    <CampoCheck label="Planicidade frontal" v-model="d.planicidadeFrontal" />
    <CampoCheck label="Planicidade traseira" v-model="d.planicidadeTraseira" />

    <TabelaMedicao
      titulo="Altura de camisa"
      :colunas="['A', 'B', 'C', 'D']"
      :linhas="linhas6"
      v-model="d.alturaPistoes"
    />

    <TabelaMedicao
      titulo="Diâmetro dos Cilindros (A=Superior / B=Meio / C=Inferior)"
      :colunas="colsCilindros"
      :linhas="linhas6"
      v-model="d.diamCilindros"
    />

    <CampoCheck label="Guias mancais" v-model="d.guiasMancais" />

    <TabelaMedicao
      titulo="Perpendicularidade dos Cilindros"
      :colunas="['0°', '90°', '180°', '270°']"
      :linhas="linhas6"
      v-model="d.perpendicularidade"
    />

    <CampoCheck label="Análise de paralelismo da base dos mancais (contraste)" v-model="d.paralelismoBase" />

    <TabelaMedicao
      titulo="Paralelismo dos Mancais"
      :colunas="['A', 'B']"
      :linhas="linhas8"
      v-model="d.paralelismoMancais"
    />

    <div class="grid2">
      <CampoMedida label="Magnetismo do bloco" unidade="Gaus Meter" v-model="d.magnetismo1" />
      <CampoMedida label="Magnetismo do bloco (2)" unidade="Gaus Meter" v-model="d.magnetismo2" />
    </div>

    <TabelaMedicao
      titulo="Rugosidade dos Cilindros"
      :colunas="['μm']"
      :linhas="linhas6"
      v-model="d.rugosidade"
    />

    <TabelaMedicao
      titulo="Buchas de Comandos"
      :colunas="['90°', '180°', '270°', 'CON']"
      :linhas="linhas6"
      v-model="d.buchasComandos"
    />
  </div>
</template>

<script setup>
import CampoCheck from './CampoCheck.vue'
import CampoMedida from './CampoMedida.vue'
import TabelaMedicao from './TabelaMedicao.vue'

const props = defineProps({ modelValue: { type: Object, default: () => ({}) } })
const emit = defineEmits(['update:modelValue'])

const linhas6 = [1, 2, 3, 4, 5, 6]
const linhas8 = [1, 2, 3, 4, 5, 6, 7, 8]

const angulos = ['0°', '45°', '135°', '180°', '225°', '265°', '315°']
const colsCilindros = angulos.flatMap(a => [`${a}A`, `${a}B`, `${a}C`])

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
.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 10px 0; }
@media (max-width: 700px) { .grid2 { grid-template-columns: 1fr; } }
</style>
