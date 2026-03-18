<template>
  <div class="tab-content">
    <h3>Cabeçote do Motor</h3>

    <TabelaMedicao
      titulo="Altura do Cabeçote"
      :colunas="['1°', '2°', '3°']"
      :linhas="['A', 'B']"
      v-model="d.alturaCabecote"
    />

    <CampoCheck label="Planicidade superior" v-model="d.planicidadeSuperior" />
    <CampoCheck label="Planicidade inferior" v-model="d.planicidadeInferior" />
    <CampoCheck label="Limpeza galerias" v-model="d.limpezaGalerias" />
    <CampoCheck label="Estado dos guias dos mancais (interferência)" v-model="d.guiasMancais" />

    <TabelaMedicao
      titulo="Alojamento Mancal Comandos - Admissão"
      :colunas="colsAngulos"
      :linhas="linhas6"
      v-model="d.alojMancalAdm"
    />

    <TabelaMedicao
      titulo="Alojamento Mancal Comandos - Escape"
      :colunas="colsAngulos"
      :linhas="linhas6"
      v-model="d.alojMancalEsc"
    />

    <TabelaMedicao
      titulo="Folga Radial Munhões e Alojamento - Admissão"
      :colunas="colsAngulos"
      :linhas="linhas6"
      v-model="d.folgaRadialAdm"
    />

    <TabelaMedicao
      titulo="Folga Radial Munhões e Alojamento - Escape"
      :colunas="colsAngulos"
      :linhas="linhas6"
      v-model="d.folgaRadialEsc"
    />

    <TabelaMedicao
      titulo="Alojamento Tucho de Válvulas - Admissão"
      :colunas="['0°A', '0°B', '90°A', '90°B']"
      :linhas="linhas16"
      v-model="d.tuchoAdm"
    />

    <TabelaMedicao
      titulo="Alojamento Tucho de Válvulas - Escape"
      :colunas="['0°A', '0°B', '90°A', '90°B']"
      :linhas="linhas16"
      v-model="d.tuchoEsc"
    />

    <TabelaMedicao
      titulo="Molas - Altura Livre Admissão"
      :colunas="['Valor']"
      :linhas="linhas16"
      v-model="d.molasAdm"
    />

    <TabelaMedicao
      titulo="Molas - Altura Livre Escape"
      :colunas="['Valor']"
      :linhas="linhas16"
      v-model="d.molasEsc"
    />

    <div class="secao-titulo">Arruelas Térmicas</div>
    <div class="grid3">
      <CampoCheck label="8" v-model="d.arruela8" />
      <CampoCheck label="16" v-model="d.arruela16" />
      <CampoCheck label="24" v-model="d.arruela24" />
    </div>

    <CampoCheck
      label="Avaliação visual das chavetas"
      v-model="d.chavetas"
      :opcoes="[
        { valor: 'substituicao', texto: 'SUBSTITUIÇÃO', cor: 'tag-danger' },
        { valor: 'nao_substituicao', texto: 'NÃO SUBSTITUIÇÃO', cor: 'tag-ok' }
      ]"
    />

    <TabelaMedicao
      titulo="Projeção de Válvulas - Admissão"
      :colunas="['Valor']"
      :linhas="linhas16"
      v-model="d.projecaoAdm"
    />

    <TabelaMedicao
      titulo="Projeção de Válvulas - Escape"
      :colunas="['Valor']"
      :linhas="linhas16"
      v-model="d.projecaoEsc"
    />

    <TabelaMedicao
      titulo="Diâmetro da Haste da Válvula"
      :colunas="['A', 'B', 'C']"
      :linhas="linhas16"
      v-model="d.hasteValvula"
    />

    <TabelaMedicao
      titulo="Diâmetro da Haste - Admissão"
      :colunas="['A', 'B', 'C']"
      :linhas="linhas8"
      v-model="d.hasteAdm"
    />

    <TabelaMedicao
      titulo="Diâmetro da Haste - Escape"
      :colunas="['A', 'B', 'C']"
      :linhas="linhas8"
      v-model="d.hasteEsc"
    />

    <TabelaMedicao
      titulo="Folga entre Válvulas ADM & Guias"
      :colunas="['A', 'B', 'C']"
      :linhas="linhas16"
      v-model="d.folgaValvAdmGuias"
    />

    <TabelaMedicao
      titulo="Folga entre Válvulas ESC & Guias"
      :colunas="['A', 'B', 'C']"
      :linhas="linhas16"
      v-model="d.folgaValvEscGuias"
    />

    <TabelaMedicao
      titulo="Teste Contraste de Válvulas / Azul - Admissão"
      :colunas="['Valor']"
      :linhas="linhas16"
      v-model="d.contrasteAdm"
    />

    <TabelaMedicao
      titulo="Teste Contraste de Válvulas / Azul - Escape"
      :colunas="['Valor']"
      :linhas="linhas16"
      v-model="d.contrasteEsc"
    />
  </div>
</template>

<script setup>
import CampoCheck from './CampoCheck.vue'
import TabelaMedicao from './TabelaMedicao.vue'

const props = defineProps({ modelValue: { type: Object, default: () => ({}) } })
const emit = defineEmits(['update:modelValue'])

const linhas6 = [1, 2, 3, 4, 5, 6]
const linhas8 = [1, 2, 3, 4, 5, 6, 7, 8]
const linhas16 = Array.from({ length: 16 }, (_, i) => i + 1)
const colsAngulos = ['0°A', '0°B', '45°A', '45°B', '85°A', '85°B', '135°A', '135°B', '180°A', '180°B', '225°A', '225°B', '265°A', '265°B', '315°A', '315°B']

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
.grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
@media (max-width: 700px) { .grid3 { grid-template-columns: 1fr; } }
</style>
