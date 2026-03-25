<template>
  <div>
    <div class="toolbar">
      <select v-model="filtroTipoMov" class="filtro-select">
        <option value="">Todas as movimentações</option>
        <option value="entrada">Entradas</option>
        <option value="reserva">Reservas</option>
        <option value="devolucao">Devoluções</option>
      </select>
      <select v-model="filtroTipoItem" class="filtro-select">
        <option value="">Todos os itens</option>
        <option value="epi">EPIs</option>
        <option value="ferramenta">Ferramentas</option>
        <option value="peca">Peças</option>
      </select>
      <input v-model="busca" class="search" placeholder="Buscar por item ou funcionário..." />
      <button class="primary" @click="$emit('nova-movimentacao')">+ Nova Movimentação</button>
    </div>

    <div class="small" style="margin: 8px 0">{{ filtradas.length }} movimentação(ões)</div>

    <div v-if="!filtradas.length" class="card"><div class="small">Nenhuma movimentação encontrada.</div></div>

    <div v-for="mov in filtradas" :key="mov.id" class="record mov-record">
      <div class="mov-header">
        <span class="badge" :class="'badge-' + mov.tipoMovimentacao">{{ labelMov(mov.tipoMovimentacao) }}</span>
        <span class="badge" :class="'badge-tipo-' + mov.tipoItem">{{ labelTipo(mov.tipoItem) }}</span>
        <strong>{{ mov.itemNome }}</strong>
        <span class="mov-qty">{{ mov.tipoMovimentacao === 'devolucao' || mov.tipoMovimentacao === 'entrada' ? '+' : '-' }}{{ mov.quantidade }}</span>
      </div>
      <div class="mov-details">
        <span v-if="mov.funcionarioNome">{{ mov.tipoMovimentacao === 'devolucao' ? 'Devolvido por' : 'Funcionário' }}: <b>{{ mov.funcionarioNome }}</b></span>
        <span v-if="mov.responsavelEntregaNome">{{ mov.tipoMovimentacao === 'devolucao' ? 'Recebido por' : 'Entregue por' }}: <b>{{ mov.responsavelEntregaNome }}</b></span>
        <span v-if="mov.ordemNumero">OS: <b>{{ mov.ordemNumero }}</b></span>
        <span v-if="mov.custoUnitario">R$ {{ mov.custoUnitario.toFixed(2) }}/un</span>
      </div>
      <div v-if="mov.observacao" class="small" style="margin-top:4px">{{ mov.observacao }}</div>
      <div class="small" style="margin-top:4px">{{ mov.criadoEm }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  movimentacoes: { type: Array, default: () => [] }
})
defineEmits(['nova-movimentacao'])

const filtroTipoMov = ref('')
const filtroTipoItem = ref('')
const busca = ref('')

const filtradas = computed(() => {
  let lista = props.movimentacoes
  if (filtroTipoMov.value) lista = lista.filter(m => m.tipoMovimentacao === filtroTipoMov.value)
  if (filtroTipoItem.value) lista = lista.filter(m => m.tipoItem === filtroTipoItem.value)
  const q = busca.value.toLowerCase().trim()
  if (q) {
    lista = lista.filter(m =>
      (m.itemNome || '').toLowerCase().includes(q) ||
      (m.funcionarioNome || '').toLowerCase().includes(q) ||
      (m.responsavelEntregaNome || '').toLowerCase().includes(q) ||
      (m.ordemNumero || '').toLowerCase().includes(q)
    )
  }
  return lista
})

function labelMov(t) {
  return { entrada: 'Entrada', reserva: 'Reserva', devolucao: 'Devolução' }[t] || t
}
function labelTipo(t) {
  return { epi: 'EPI', ferramenta: 'Ferramenta', peca: 'Peça' }[t] || t
}
</script>

<style scoped>
.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
.toolbar .search { flex: 1; min-width: 180px; }

.filtro-select {
  padding: 8px 10px;
  border: 1px solid var(--line);
  border-radius: 8px;
  font-size: 13px;
  background: #fff;
}

.mov-record { padding: 12px 14px; }

.mov-header {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.mov-qty {
  margin-left: auto;
  font-weight: 700;
  font-size: 16px;
}

.mov-details {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 6px;
  font-size: 13px;
  color: var(--muted);
}

.badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
}
.badge-entrada { background: var(--ok-bg); color: var(--ok); }
.badge-reserva { background: #e0f2fe; color: #0369a1; }
.badge-devolucao { background: #fef3c7; color: #92400e; }

.badge-tipo-epi { background: #e0f2fe; color: #0369a1; }
.badge-tipo-ferramenta { background: #fef3c7; color: #92400e; }
.badge-tipo-peca { background: #ede9fe; color: #6d28d9; }
</style>
