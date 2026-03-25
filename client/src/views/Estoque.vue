<template>
  <div>
    <div class="card">
      <h2 style="margin: 0">Controle de Estoque</h2>
    </div>

    <div class="card">
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="tab-btn"
          :class="{ 'tab-ativo': abaAtiva === tab.id }"
          @click="abaAtiva = tab.id"
        >
          {{ tab.label }}
          <span v-if="tab.id === 'solicitacoes' && totalSolicitacoes > 0" class="tab-badge">{{ totalSolicitacoes }}</span>
        </button>
      </div>
    </div>

    <div v-if="carregando" class="card">
      <span class="spinner"></span> Carregando...
    </div>

    <template v-else>
      <div v-if="!itens.length && abaAtiva === 'itens' && isAdmin" class="card seed-card">
        <p>Nenhum item cadastrado ainda.</p>
        <p class="small">Deseja popular o estoque com <b>{{ totalSeed }}</b> itens padrão de retífica? (Peças, Ferramentas e EPIs)</p>
        <button class="primary" @click="executarSeed" :disabled="seedRodando">
          <span v-if="seedRodando"><span class="spinner"></span> Cadastrando itens... {{ seedProgresso }}/{{ totalSeed }}</span>
          <span v-else>Popular com itens padrão de retífica</span>
        </button>
      </div>

      <TabItens
        v-if="abaAtiva === 'itens'"
        :itens="itens"
        :admin="isAdmin"
        @novo-item="abrirFormItem(null)"
        @editar-item="abrirFormItem"
        @nova-movimentacao="abrirFormMov"
      />

      <TabMovimentacoes
        v-if="abaAtiva === 'movimentacoes'"
        :movimentacoes="movimentacoes"
        :admin="isAdmin"
        @nova-movimentacao="abrirFormMov('entrada')"
      />

      <TabSolicitacoes
        v-if="abaAtiva === 'solicitacoes'"
        :solicitacoes="solicitacoes"
        :itens="itens"
        @atualizar="recarregar"
      />
    </template>

    <FormItem
      v-if="mostrarFormItem"
      :item="itemEditando"
      @fechar="mostrarFormItem = false"
      @salvo="onItemSalvo"
    />

    <FormMovimentacao
      v-if="mostrarFormMov"
      :tipo-inicial="tipoMovInicial"
      @fechar="mostrarFormMov = false"
      @salvo="onMovSalva"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'
import { carregarItens, carregarMovimentacoes, carregarSolicitacoesPendentes } from '../services/estoque'

const { isAdmin } = useAuth()
import { popularEstoqueInicial, TOTAL_ITENS_SEED } from '../services/seedEstoque'
import TabItens from '../components/estoque/TabItens.vue'
import TabMovimentacoes from '../components/estoque/TabMovimentacoes.vue'
import TabSolicitacoes from '../components/estoque/TabSolicitacoes.vue'
import FormItem from '../components/estoque/FormItem.vue'
import FormMovimentacao from '../components/estoque/FormMovimentacao.vue'

const tabs = [
  { id: 'itens', label: 'Itens de Estoque' },
  { id: 'movimentacoes', label: 'Movimentações' },
  { id: 'solicitacoes', label: 'Solicitações' }
]

const abaAtiva = ref('itens')
const carregando = ref(true)
const itens = ref([])
const movimentacoes = ref([])
const solicitacoes = ref([])

const mostrarFormItem = ref(false)
const itemEditando = ref(null)
const mostrarFormMov = ref(false)
const tipoMovInicial = ref('entrada')

const totalSolicitacoes = computed(() => solicitacoes.value.length)
const totalSeed = TOTAL_ITENS_SEED
const seedRodando = ref(false)
const seedProgresso = ref(0)

async function executarSeed() {
  if (!confirm(`Deseja cadastrar ${totalSeed} itens padrão de retífica (peças, ferramentas e EPIs)?`)) return
  seedRodando.value = true
  seedProgresso.value = 0
  try {
    const result = await popularEstoqueInicial()
    seedProgresso.value = result.criados
    alert(`${result.criados} de ${result.total} itens cadastrados com sucesso!`)
    await recarregar()
  } catch (e) {
    console.error('Erro no seed:', e)
    alert('Erro ao popular estoque: ' + e.message)
  } finally {
    seedRodando.value = false
  }
}

function abrirFormItem(item) {
  itemEditando.value = item
  mostrarFormItem.value = true
}

function abrirFormMov(tipo = 'entrada') {
  tipoMovInicial.value = tipo
  mostrarFormMov.value = true
}

function onItemSalvo() {
  mostrarFormItem.value = false
  recarregar()
}

function onMovSalva() {
  mostrarFormMov.value = false
  recarregar()
}

async function recarregar() {
  carregando.value = true
  try {
    const [i, m, s] = await Promise.all([
      carregarItens(),
      carregarMovimentacoes(),
      carregarSolicitacoesPendentes()
    ])
    itens.value = i
    movimentacoes.value = m
    solicitacoes.value = s
  } catch (e) {
    console.error('Erro ao carregar estoque:', e)
  } finally {
    carregando.value = false
  }
}

onMounted(recarregar)
</script>

<style scoped>
.tabs {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  background: transparent;
  color: var(--muted);
  position: relative;
}

.tab-btn:hover { background: #f0f4ff; color: var(--text); }

.tab-ativo {
  background: var(--accent);
  color: #fff;
}
.tab-ativo:hover { background: var(--accent-hover); color: #fff; }

.seed-card {
  text-align: center;
  padding: 24px;
}
.seed-card p { margin: 0 0 8px; }

.tab-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  background: var(--danger);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  margin-left: 4px;
}
</style>
