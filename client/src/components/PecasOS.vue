<template>
  <div class="pecas-os" @click="fecharDropdown">
    <h2>Peças que vão ser trocadas/utilizadas</h2>

    <div class="busca-peca" @click.stop>
      <input
        ref="inputBusca"
        v-model="buscaPeca"
        placeholder="Digite para buscar peça por nome, código ou alias..."
        @input="onBusca"
        @focus="onBusca"
        @keydown.down.prevent="navegar(1)"
        @keydown.up.prevent="navegar(-1)"
        @keydown.enter.prevent="selecionarAtual"
        @keydown.escape="fecharDropdown"
      />
      <div v-if="dropdownAberto && resultadosBusca.length" class="busca-dropdown">
        <div
          v-for="(item, idx) in resultadosBusca"
          :key="item.id"
          class="busca-item"
          :class="{ 'busca-item-ativo': idx === indiceSelecionado }"
          @click="adicionarPeca(item)"
          @mouseenter="indiceSelecionado = idx"
        >
          <div class="busca-item-main">
            <strong>{{ item.nome }} </strong>
            <span v-if="item.codigo" class="codigo"> {{ item.codigo }}</span>
          </div>
          <div class="busca-item-meta">
            <span class="badge-sub">{{ item.subcategoria || item.tipo }}</span>
            <span
              class="badge-disp"
              :class="(item.quantidadeDisponivel ?? 0) > 0 ? 'disp-ok' : 'disp-sem'"
            >
              {{ (item.quantidadeDisponivel ?? 0) > 0
                ? `${item.quantidadeDisponivel} ${item.unidade || 'un'} disponível`
                : 'Sem estoque' }}
            </span>
            <span v-if="item.aliases?.length" class="aliases-hint">{{ item.aliases.slice(0, 2).join(', ') }}</span>
          </div>
        </div>
      </div>
      <div v-else-if="dropdownAberto && buscaPeca.trim().length >= 2 && !resultadosBusca.length" class="busca-dropdown">
        <div class="busca-vazio">Nenhuma peça encontrada para "{{ buscaPeca }}"</div>
      </div>
    </div>

    <div v-if="!pecas.length" class="small" style="margin-top: 8px">Nenhuma peça adicionada.</div>

    <div v-for="(peca, i) in pecas" :key="i" class="peca-row">
      <div class="peca-info">
        <strong>{{ peca.itemNome }}</strong>
        <span v-if="peca.itemCodigo" class="small"> ({{ peca.itemCodigo }})</span>
      </div>
      <div class="peca-controles">
        <label class="qty-label">Qtd:</label>
        <input
          v-model.number="peca.quantidade"
          type="number"
          min="1"
          class="qty-input"
          @change="emitAtualizar"
        />
        <span class="badge" :class="badgeClass(peca)">{{ badgeTexto(peca) }}</span>
        <button
          v-if="peca.status === 'solicitada' && estoqueDisponivel(peca) >= peca.quantidade"
          class="primary btn-sm"
          :disabled="reservando"
          @click="reservarPeca(i)"
        >Reservar</button>
        <button class="danger btn-sm" @click="removerPeca(i)">Remover</button>
      </div>
    </div>

    <div v-if="custoTotal > 0" class="custo-total">
      Custo estimado das peças: <b>R$ {{ custoTotal.toFixed(2) }}</b>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { carregarItens, buscarItensTexto, buscarItem, registrarReserva } from '../services/estoque'

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  ordemId: { type: String, default: '' },
  ordemNumero: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue'])

const itensEstoque = ref([])
const buscaPeca = ref('')
const resultadosBusca = ref([])
const reservando = ref(false)
const dropdownAberto = ref(false)
const indiceSelecionado = ref(0)
const inputBusca = ref(null)

const pecas = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const custoTotal = computed(() => {
  return pecas.value.reduce((acc, p) => {
    const item = itensEstoque.value.find(i => i.id === p.itemId)
    return acc + (item?.custoUnitario || 0) * (p.quantidade || 0)
  }, 0)
})

function estoqueDisponivel(peca) {
  const item = itensEstoque.value.find(i => i.id === peca.itemId)
  return item?.quantidadeDisponivel ?? 0
}

function badgeClass(peca) {
  if (peca.status === 'reservada') return 'badge-reservada'
  if (estoqueDisponivel(peca) >= peca.quantidade) return 'badge-disponivel'
  return 'badge-solicitada'
}

function badgeTexto(peca) {
  if (peca.status === 'reservada') return 'Reservada'
  if (estoqueDisponivel(peca) >= peca.quantidade) return `Disponível (${estoqueDisponivel(peca)})`
  if (estoqueDisponivel(peca) > 0) return `Parcial (${estoqueDisponivel(peca)})`
  return 'Sem estoque'
}

function onBusca() {
  const q = buscaPeca.value.trim()
  if (q.length < 1) {
    resultadosBusca.value = []
    dropdownAberto.value = false
    return
  }
  const pecasTipo = itensEstoque.value.filter(i => i.tipo === 'peca')
  const jaAdicionados = new Set(pecas.value.map(p => p.itemId))
  resultadosBusca.value = buscarItensTexto(pecasTipo, q)
    .filter(i => !jaAdicionados.has(i.id))
    .slice(0, 10)
  indiceSelecionado.value = 0
  dropdownAberto.value = true
}

function navegar(dir) {
  if (!resultadosBusca.value.length) return
  indiceSelecionado.value = Math.max(0, Math.min(resultadosBusca.value.length - 1, indiceSelecionado.value + dir))
}

function selecionarAtual() {
  if (resultadosBusca.value.length && indiceSelecionado.value >= 0) {
    adicionarPeca(resultadosBusca.value[indiceSelecionado.value])
  }
}

function fecharDropdown() {
  dropdownAberto.value = false
}

function adicionarPeca(item) {
  const jaExiste = pecas.value.find(p => p.itemId === item.id)
  if (jaExiste) {
    alert('Esta peça já foi adicionada.')
    buscaPeca.value = ''
    fecharDropdown()
    return
  }

  const nova = {
    itemId: item.id,
    itemNome: item.nome,
    itemCodigo: item.codigo || '',
    quantidade: 1,
    status: 'solicitada',
    movimentacaoId: null
  }

  emit('update:modelValue', [...pecas.value, nova])
  buscaPeca.value = ''
  fecharDropdown()
  inputBusca.value?.focus()
}

function removerPeca(idx) {
  if (pecas.value[idx].status === 'reservada') {
    alert('Peça já reservada. Remova a reserva antes pelo controle de estoque.')
    return
  }
  const novas = [...pecas.value]
  novas.splice(idx, 1)
  emit('update:modelValue', novas)
}

function emitAtualizar() {
  emit('update:modelValue', [...pecas.value])
}

async function reservarPeca(idx) {
  const peca = pecas.value[idx]
  if (!props.ordemId) {
    alert('Salve a OS primeiro antes de reservar peças.')
    return
  }

  const item = await buscarItem(peca.itemId)
  if (!item || (item.quantidadeDisponivel ?? 0) < peca.quantidade) {
    alert('Estoque insuficiente.')
    return
  }

  reservando.value = true
  try {
    const movId = await registrarReserva({
      itemId: peca.itemId,
      itemNome: peca.itemNome,
      tipoItem: 'peca',
      quantidade: peca.quantidade,
      custoUnitario: item.custoUnitario || 0,
      ordemId: props.ordemId,
      ordemNumero: props.ordemNumero
    })

    const novas = [...pecas.value]
    novas[idx] = { ...novas[idx], status: 'reservada', movimentacaoId: movId }
    emit('update:modelValue', novas)

    itensEstoque.value = await carregarItens()

    alert('Peça reservada com sucesso.')
  } catch (e) {
    console.error('Erro ao reservar:', e)
    alert('Erro: ' + e.message)
  } finally {
    reservando.value = false
  }
}

onMounted(async () => {
  itensEstoque.value = await carregarItens()
})
</script>

<style scoped>
.pecas-os { margin-top: 16px; }

.busca-peca {
  position: relative;
  margin-top: 8px;
}
.busca-peca input { width: 100%; }

.busca-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 0 0 8px 8px;
  max-height: 280px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
}

.busca-item {
  padding: 10px 12px;
  cursor: pointer;
  border-bottom: 1px solid #f5f5f5;
}
.busca-item:last-child { border-bottom: none; }
.busca-item:hover,
.busca-item-ativo { background: #f0f4ff; }

.busca-item-main {
  font-size: 14px;
}
.codigo {
  color: var(--muted);
  font-size: 12px;
}

.busca-item-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 3px;
  align-items: center;
}

.badge-sub {
  padding: 1px 6px;
  border-radius: 999px;
  background: #f1f5f9;
  color: #475569;
  font-size: 10px;
  font-weight: 600;
}
.badge-disp {
  font-size: 11px;
  font-weight: 600;
}
.disp-ok { color: var(--ok); }
.disp-sem { color: var(--danger); }

.aliases-hint {
  font-size: 10px;
  color: #94a3b8;
  font-style: italic;
}

.busca-vazio {
  padding: 12px;
  text-align: center;
  color: var(--muted);
  font-size: 13px;
}

.peca-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.peca-info { flex: 1; min-width: 150px; }

.peca-controles {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.qty-label { font-size: 13px; font-weight: 600; }
.qty-input {
  width: 60px;
  padding: 6px 8px;
  border: 1px solid var(--line);
  border-radius: 6px;
  font-size: 13px;
  text-align: center;
}

.badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
}
.badge-reservada { background: var(--ok-bg); color: var(--ok); }
.badge-disponivel { background: #e0f2fe; color: #0369a1; }
.badge-solicitada { background: var(--danger-bg); color: var(--danger); }

.btn-sm { padding: 6px 10px; font-size: 12px; }

.custo-total {
  margin-top: 12px;
  padding: 10px;
  background: #f8fafc;
  border-radius: 8px;
  font-size: 14px;
}
</style>
