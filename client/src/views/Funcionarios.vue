<template>
  <div>
    <div class="card">
      <h2 style="margin: 0">Funcionários</h2>
    </div>

    <div class="card">
      <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center">
        <input v-model="busca" class="search" placeholder="Buscar por nome ou cargo..." style="flex:1; min-width:200px" />
        <button class="primary" @click="abrirForm(null)">+ Novo Funcionário</button>
      </div>
      <div class="small" style="margin-top: 8px">{{ filtrados.length }} funcionário(s)</div>
    </div>

    <div v-if="carregando" class="card">
      <span class="spinner"></span> Carregando...
    </div>

    <template v-else>
      <div v-if="!filtrados.length" class="card"><div class="small">Nenhum funcionário encontrado.</div></div>

      <div v-for="func in filtrados" :key="func.id" class="record" @click="toggleExpand(func.id)">
        <div class="record-top">
          <div>
            <strong>{{ func.nome }}</strong>
            <span v-if="func.cargo" class="small"> — {{ func.cargo }}</span>
          </div>
          <div class="func-acoes">
            <span class="badge" :class="func.ativo !== false ? 'badge-ativo' : 'badge-inativo'">
              {{ func.ativo !== false ? 'Ativo' : 'Inativo' }}
            </span>
            <button
              class="btn-sm"
              :class="func.ativo !== false ? 'danger' : 'ok'"
              @click.stop="toggleAtivo(func)"
            >{{ func.ativo !== false ? 'Desativar' : 'Ativar' }}</button>
            <button class="secondary btn-sm" @click.stop="abrirForm(func)">Editar</button>
          </div>
        </div>

        <div v-if="expandidos.has(func.id)" class="func-detalhes">
          <div v-if="carregandoDetalhes === func.id" class="small"><span class="spinner"></span> Carregando...</div>
          <template v-else>
            <div v-if="itensPosse[func.id]?.length" class="secao-detalhes">
              <h3>Itens em posse</h3>
              <div v-for="item in itensPosse[func.id]" :key="item.itemId" class="posse-row">
                <span class="badge" :class="'badge-' + item.tipoItem">{{ labelTipo(item.tipoItem) }}</span>
                <span>{{ item.itemNome }}</span>
                <span class="small">Qtd: {{ item.quantidade }}</span>
              </div>
            </div>
            <div v-else class="small" style="margin-top:8px">Nenhum item em posse.</div>

            <div v-if="historicoFunc[func.id]?.length" class="secao-detalhes">
              <h3>Histórico recente</h3>
              <div v-for="mov in historicoFunc[func.id].slice(0, 10)" :key="mov.id" class="hist-row">
                <span class="badge" :class="'badge-mov-' + mov.tipoMovimentacao">{{ labelMov(mov.tipoMovimentacao) }}</span>
                <span>{{ mov.itemNome }} — {{ mov.quantidade }} un</span>
                <span v-if="mov.ordemNumero" class="small">OS {{ mov.ordemNumero }}</span>
                <span class="small">{{ mov.criadoEm }}</span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </template>

    <FormFuncionario
      v-if="mostrarForm"
      :funcionario="funcEditando"
      @fechar="mostrarForm = false"
      @salvo="onSalvo"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  carregarFuncionarios,
  toggleAtivoFuncionario,
  calcularItensEmPosse,
  carregarMovimentacoesPorFuncionario
} from '../services/funcionarios'
import FormFuncionario from '../components/estoque/FormFuncionario.vue'

const funcionarios = ref([])
const busca = ref('')
const carregando = ref(true)
const expandidos = ref(new Set())
const carregandoDetalhes = ref(null)
const itensPosse = ref({})
const historicoFunc = ref({})

const mostrarForm = ref(false)
const funcEditando = ref(null)

const filtrados = computed(() => {
  const q = busca.value.toLowerCase().trim()
  if (!q) return funcionarios.value
  return funcionarios.value.filter(f =>
    (f.nome || '').toLowerCase().includes(q) ||
    (f.cargo || '').toLowerCase().includes(q)
  )
})

function abrirForm(func) {
  funcEditando.value = func
  mostrarForm.value = true
}

function onSalvo() {
  mostrarForm.value = false
  fetchDados()
}

async function toggleAtivo(func) {
  const novoEstado = func.ativo === false
  const msg = novoEstado ? `Ativar ${func.nome}?` : `Desativar ${func.nome}?`
  if (!confirm(msg)) return
  await toggleAtivoFuncionario(func.id, novoEstado)
  await fetchDados()
}

async function toggleExpand(id) {
  if (expandidos.value.has(id)) {
    expandidos.value.delete(id)
    return
  }
  expandidos.value.add(id)

  if (!itensPosse.value[id]) {
    carregandoDetalhes.value = id
    try {
      const [posse, historico] = await Promise.all([
        calcularItensEmPosse(id),
        carregarMovimentacoesPorFuncionario(id)
      ])
      itensPosse.value = { ...itensPosse.value, [id]: posse }
      historicoFunc.value = { ...historicoFunc.value, [id]: historico }
    } catch (e) {
      console.error('Erro ao carregar detalhes:', e)
    } finally {
      carregandoDetalhes.value = null
    }
  }
}

async function fetchDados() {
  carregando.value = true
  try {
    funcionarios.value = await carregarFuncionarios()
  } catch (e) {
    console.error('Erro ao carregar funcionários:', e)
  } finally {
    carregando.value = false
  }
}

function labelTipo(t) {
  return { epi: 'EPI', ferramenta: 'Ferramenta', peca: 'Peça' }[t] || t
}
function labelMov(t) {
  return { entrada: 'Entrada', reserva: 'Reserva', devolucao: 'Devolução' }[t] || t
}

onMounted(fetchDados)
</script>

<style scoped>
.record { cursor: pointer; }

.func-acoes {
  display: flex;
  gap: 6px;
  align-items: center;
}

.badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
}
.badge-ativo { background: var(--ok-bg); color: var(--ok); }
.badge-inativo { background: var(--danger-bg); color: var(--danger); }
.badge-epi { background: #e0f2fe; color: #0369a1; }
.badge-ferramenta { background: #fef3c7; color: #92400e; }
.badge-peca { background: #ede9fe; color: #6d28d9; }

.badge-mov-entrada { background: var(--ok-bg); color: var(--ok); }
.badge-mov-reserva { background: #e0f2fe; color: #0369a1; }
.badge-mov-devolucao { background: #fef3c7; color: #92400e; }

.btn-sm { padding: 6px 10px; font-size: 12px; }

.func-detalhes {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--line);
}

.secao-detalhes { margin-top: 12px; }
.secao-detalhes h3 { font-size: 14px; margin: 0 0 6px; }

.posse-row {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 4px 0;
  font-size: 13px;
  border-bottom: 1px solid #f5f5f5;
}

.hist-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  padding: 4px 0;
  font-size: 13px;
  border-bottom: 1px solid #f5f5f5;
}
</style>
