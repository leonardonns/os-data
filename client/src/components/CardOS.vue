<template>
  <div class="card record">
    <div class="record-top">
      <div>
        <h2 style="margin: 0 0 6px; font-size: 18px">OS {{ ordem.os }}</h2>
        <div class="small">
          Criado em: {{ ordem.criadoEm || '-' }}
          <span v-if="ordem.atualizadoEm"> | Atualizado em: {{ ordem.atualizadoEm }}</span>
        </div>
      </div>
      <div class="actions" style="margin-top: 0">
        <RouterLink :to="`/visualizar/${ordem.id}`" class="btn secondary">Visualizar</RouterLink>
        <RouterLink :to="`/ficha-tecnica/${ordem.id}`" class="btn ficha-btn">Ficha Técnica</RouterLink>
        <RouterLink :to="`/editar/${ordem.id}`" class="btn primary">Editar</RouterLink>
        <button class="danger" @click="$emit('excluir', ordem.id)">Excluir</button>
      </div>
    </div>

    <div class="meta">
      <div><b>Proprietário</b>{{ ordem.proprietario || ordem.cliente || '-' }}</div>
      <div><b>Motor</b>{{ ordem.motor || '-' }}</div>
      <div><b>Chassi</b>{{ ordem.chassi || '-' }}</div>
      <div><b>Quilometragem</b>{{ ordem.quilometragem || '-' }}</div>
      <div><b>Nº do Bloco</b>{{ ordem.numeroBloco || '-' }}</div>
      <div><b>Placa</b>{{ ordem.placa || '-' }}</div>
      <div><b>Veículo</b>{{ ordem.veiculo || '-' }}</div>
      <div><b>Serviço executado</b><span v-html="servicoFormatado"></span></div>
    </div>

    <CarrosselFotos :fotos="ordem.fotos || []" />

    <ListaArquivos
      :arquivos="ordem.arquivos || []"
      @remover="(idx) => $emit('remover-arquivo', ordem.id, idx)"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import CarrosselFotos from './CarrosselFotos.vue'
import ListaArquivos from './ListaArquivos.vue'

const props = defineProps({
  ordem: { type: Object, required: true }
})

defineEmits(['excluir', 'remover-arquivo'])

const servicoFormatado = computed(() => {
  return (props.ordem.servico || '-').replace(/\n/g, '<br>')
})
</script>

<style scoped>
.btn {
  display: inline-block;
  border: none;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
  transition: opacity 0.2s;
}

.btn:hover { opacity: 0.85; }

.ficha-btn {
  background: #e8f5e9;
  color: #137333;
}
</style>
