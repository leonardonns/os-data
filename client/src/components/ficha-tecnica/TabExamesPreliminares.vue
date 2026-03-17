<template>
  <div class="tab-content">
    <h3>Exames Preliminares</h3>

    <CampoCheck label="Exame visual da borracha Damper" v-model="d.borrachaDamper" />

    <div class="grid2">
      <CampoMedida label="Deslocamento polia Damper" unidade="mm" v-model="d.deslocamentoPoliaDamper" />
      <CampoMedida label="Concentricidade polia Damper" unidade="mm" v-model="d.concentricidadePoliaDamper" />
    </div>

    <div class="grid2">
      <CampoMedida label="Deslocamento volante do motor" unidade="mm" v-model="d.deslocamentoVolante" />
      <CampoMedida label="Concentricidade volante do motor" unidade="mm" v-model="d.concentricidadeVolante" />
    </div>

    <div class="grid2">
      <CampoMedida label="Nº dentes deslocamento" v-model="d.numDentesDeslocamento" />
      <CampoMedida label="Placa volante Nº" v-model="d.placaVolanteNum" />
    </div>

    <CampoCheck label="Rolamento/bucha interna do volante" v-model="d.rolamentoVolante" />
    <CampoCheck label="Cremalheira estado visual" v-model="d.cremalheira" />
    <CampoCheck label="Roda fônica estado visual" v-model="d.rodaFonica" />
    <CampoCheck label="Chicote motor" v-model="d.chicoteMotor" />

    <CampoCheck
      label="Bomba alta pressão (bomba injetora)"
      v-model="d.bombaAltaPressao"
      :opcoes="[
        { valor: 'reparo', texto: 'REPARO', cor: 'tag-danger' },
        { valor: 'nao_reparo', texto: 'NÃO REPARO', cor: 'tag-ok' }
      ]"
    />

    <CampoCheck
      label="Tubo Rail"
      v-model="d.tuboRail"
      :opcoes="[
        { valor: 'limpeza', texto: 'LIMPEZA', cor: 'tag-default' },
        { valor: 'nao_limpeza', texto: 'NÃO LIMPEZA', cor: 'tag-ok' }
      ]"
    />

    <CampoCheck
      label="Canos injetores"
      v-model="d.canosInjetores"
      :opcoes="[
        { valor: 'limpeza', texto: 'LIMPEZA', cor: 'tag-default' },
        { valor: 'nao_limpeza', texto: 'NÃO LIMPEZA', cor: 'tag-ok' }
      ]"
    />

    <CampoCheck
      label="Porta injetores"
      v-model="d.portaInjetores"
      :opcoes="[
        { valor: 'teste_bancada', texto: 'TESTE BANCADA', cor: 'tag-default' },
        { valor: 'nao_teste', texto: 'NÃO TESTE', cor: 'tag-ok' }
      ]"
    />

    <CampoCheck label="Tampa de válvulas (trincas / retentores)" v-model="d.tampaValvulas" />
    <CampoCheck label="Carcaça da distribuição" v-model="d.carcacaDistribuicao" />
  </div>
</template>

<script setup>
import CampoCheck from './CampoCheck.vue'
import CampoMedida from './CampoMedida.vue'

const props = defineProps({ modelValue: { type: Object, default: () => ({}) } })
const emit = defineEmits(['update:modelValue'])

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
.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 10px 0; }
@media (max-width: 700px) { .grid2 { grid-template-columns: 1fr; } }
</style>
