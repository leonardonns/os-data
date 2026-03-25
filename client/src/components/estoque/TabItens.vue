<template>
  <div>
    <div class="toolbar">
      <input v-model="busca" class="search" placeholder="Buscar por nome, código ou alias..." />
      <div class="toolbar-btns">
        <select v-model="filtroTipo" class="filtro-select">
          <option value="">Todos os tipos</option>
          <option value="epi">EPIs</option>
          <option value="ferramenta">Ferramentas</option>
          <option value="peca">Peças</option>
        </select>
        <button v-if="admin" class="primary" @click="$emit('novo-item')">+ Novo Item</button>
        <button v-if="admin" class="ok" @click="$emit('nova-movimentacao', 'entrada')">Entrada</button>
        <button v-if="admin" class="secondary" @click="$emit('nova-movimentacao', 'reserva')">Reservar</button>
      </div>
    </div>

    <div class="small" style="margin: 8px 0">{{ filtrados.length }} item(ns)</div>

    <div v-if="!filtrados.length" class="card"><div class="small">Nenhum item encontrado.</div></div>

    <div v-for="item in filtrados" :key="item.id" class="record" @click="toggle(item.id)">
      <div class="record-top">
        <div class="item-header">
          <img v-if="item.foto?.url" :src="item.foto.url" alt="" class="item-thumb" />
          <div>
            <strong>{{ item.nome }}</strong>
            <span v-if="item.codigo" class="small"> ({{ item.codigo }})</span>
            <div class="badges">
              <span class="badge" :class="'badge-' + item.tipo">{{ labelTipo(item.tipo) }}</span>
              <span v-if="item.subcategoria" class="badge badge-sub">{{ item.subcategoria }}</span>
              <span v-if="estoqueBaixo(item)" class="badge badge-alerta">Estoque baixo</span>
            </div>
          </div>
        </div>
        <div class="item-numbers">
          <div v-if="item.tipo !== 'peca'" class="num-line">
            <b>{{ item.quantidadeDisponivel ?? 0 }}</b> disp / <b>{{ item.quantidade ?? 0 }}</b> total
            <span v-if="(item.quantidade - (item.quantidadeDisponivel ?? 0)) > 0" class="small">
              ({{ item.quantidade - (item.quantidadeDisponivel ?? 0) }} reserv.)
            </span>
          </div>
          <div v-else class="num-line"><b>{{ item.quantidadeDisponivel ?? item.quantidade ?? 0 }}</b> {{ item.unidade || 'un' }}</div>
          <div v-if="item.custoUnitario" class="small">R$ {{ item.custoUnitario.toFixed(2) }}</div>
          <div v-if="item.localizacao" class="small loc-line">{{ item.localizacao }}</div>
        </div>
      </div>

      <div v-if="expandidos.has(item.id)" class="item-detalhes">
        <div class="meta">
          <div v-if="item.aliases?.length"><b>Aliases</b>{{ item.aliases.join(', ') }}</div>
          <div v-if="item.fornecedorNome"><b>Fornecedor</b>{{ item.fornecedorNome }} {{ item.fornecedorContato ? `(${item.fornecedorContato})` : '' }}</div>
          <div v-if="item.compatibilidade?.length"><b>Compatibilidade</b>{{ item.compatibilidade.join(', ') }}</div>
          <div v-if="item.descricao"><b>Descrição</b>{{ item.descricao }}</div>
          <div><b>Estoque Mínimo</b>{{ item.estoqueMinimo ?? 0 }}</div>
        </div>
        <div class="detalhes-acoes">
          <button v-if="admin" class="secondary btn-sm" @click.stop="$emit('editar-item', item)">Editar</button>
          <button class="secondary btn-sm" @click.stop="carregarHistorico(item.id)">
            {{ historicoItem === item.id ? 'Fechar histórico' : 'Ver histórico' }}
          </button>
        </div>
        <div v-if="historicoItem === item.id && historicoLista.length" class="historico-lista">
          <div v-for="mov in historicoLista" :key="mov.id" class="hist-row">
            <span class="badge" :class="'badge-mov-' + mov.tipoMovimentacao">{{ labelMov(mov.tipoMovimentacao) }}</span>
            <span>{{ mov.quantidade }} {{ item.unidade || 'un' }}</span>
            <span v-if="mov.funcionarioNome" class="small">{{ mov.funcionarioNome }}</span>
            <span v-if="mov.ordemNumero" class="small">OS {{ mov.ordemNumero }}</span>
            <span class="small">{{ mov.criadoEm }}</span>
          </div>
        </div>
        <div v-if="historicoItem === item.id && !historicoLista.length" class="small" style="margin-top:8px">Nenhuma movimentação.</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { buscarItensTexto, carregarMovimentacoesPorItem } from '../../services/estoque'

const props = defineProps({
  itens: { type: Array, default: () => [] },
  admin: { type: Boolean, default: false }
})
defineEmits(['novo-item', 'editar-item', 'nova-movimentacao'])

const busca = ref('')
const filtroTipo = ref('')
const expandidos = ref(new Set())
const historicoItem = ref(null)
const historicoLista = ref([])

const filtrados = computed(() => {
  let lista = props.itens
  if (filtroTipo.value) lista = lista.filter(i => i.tipo === filtroTipo.value)
  return buscarItensTexto(lista, busca.value)
})

function estoqueBaixo(item) {
  const disp = item.quantidadeDisponivel ?? item.quantidade ?? 0
  return item.estoqueMinimo > 0 && disp <= item.estoqueMinimo
}

function toggle(id) {
  if (expandidos.value.has(id)) {
    expandidos.value.delete(id)
    if (historicoItem.value === id) historicoItem.value = null
  } else {
    expandidos.value.add(id)
  }
}

async function carregarHistorico(itemId) {
  if (historicoItem.value === itemId) {
    historicoItem.value = null
    historicoLista.value = []
    return
  }
  historicoItem.value = itemId
  historicoLista.value = await carregarMovimentacoesPorItem(itemId)
}

function labelTipo(t) {
  return { epi: 'EPI', ferramenta: 'Ferramenta', peca: 'Peça' }[t] || t
}

function labelMov(t) {
  return { entrada: 'Entrada', reserva: 'Reserva', devolucao: 'Devolução' }[t] || t
}
</script>

<style scoped>
.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
.toolbar .search { flex: 1; min-width: 200px; }
.toolbar-btns { display: flex; flex-wrap: wrap; gap: 6px; }

.filtro-select {
  padding: 8px 10px;
  border: 1px solid var(--line);
  border-radius: 8px;
  font-size: 13px;
  background: #fff;
}

.item-header {
  display: flex;
  gap: 10px;
  align-items: center;
}

.item-thumb {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid var(--line);
}

.badges { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px; }
.badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
}
.badge-epi { background: #e0f2fe; color: #0369a1; }
.badge-ferramenta { background: #fef3c7; color: #92400e; }
.badge-peca { background: #ede9fe; color: #6d28d9; }
.badge-sub { background: #f1f5f9; color: #475569; }
.badge-alerta { background: var(--danger-bg); color: var(--danger); }

.badge-mov-entrada { background: var(--ok-bg); color: var(--ok); }
.badge-mov-reserva { background: #e0f2fe; color: #0369a1; }
.badge-mov-devolucao { background: #fef3c7; color: #92400e; }

.item-numbers { text-align: right; min-width: 120px; }
.num-line { font-size: 14px; }
.loc-line { font-style: italic; }

.item-detalhes {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--line);
}

.detalhes-acoes {
  display: flex;
  gap: 6px;
  margin-top: 8px;
}

.btn-sm { padding: 6px 10px; font-size: 12px; }

.historico-lista { margin-top: 10px; }
.hist-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 13px;
}

.record { cursor: pointer; }

@media (max-width: 700px) {
  .record-top { flex-direction: column; }
  .item-numbers { text-align: left; }
}
</style>
