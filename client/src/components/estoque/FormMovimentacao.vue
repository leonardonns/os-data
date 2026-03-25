<template>
  <div class="modal-overlay" @click.self="$emit('fechar')">
    <div class="modal-card">
      <h2>{{ tituloModal }}</h2>

      <div class="grid">
        <div class="full">
          <label>Tipo de Movimentação *</label>
          <select v-model="form.tipoMovimentacao" @change="onTipoChange">
            <option value="entrada">Entrada (compra/recebimento)</option>
            <option value="reserva">Reserva (funcionário ou OS)</option>
            <option value="devolucao">Devolução</option>
          </select>
        </div>

        <div class="full">
          <label>Item *</label>
          <select v-model="form.itemId" @change="onItemChange">
            <option value="">Selecione um item...</option>
            <option v-for="item in itensDisponiveis" :key="item.id" :value="item.id">
              {{ item.nome }} {{ item.codigo ? `(${item.codigo})` : '' }} — {{ item.tipo.toUpperCase() }} — Disp: {{ item.quantidadeDisponivel ?? item.quantidade }}
            </option>
          </select>
        </div>

        <div>
          <label>Quantidade *</label>
          <input v-model.number="form.quantidade" type="number" min="1" placeholder="1" />
        </div>
        <div>
          <label>Custo Unitário (R$)</label>
          <input v-model.number="form.custoUnitario" type="number" min="0" step="0.01" :placeholder="custoSugerido" />
        </div>

        <template v-if="form.tipoMovimentacao !== 'entrada'">
          <div>
            <label>{{ form.tipoMovimentacao === 'devolucao' ? 'Funcionário que devolve *' : 'Funcionário que retira *' }}</label>
            <select v-model="form.funcionarioId" @change="onFuncChange">
              <option value="">Selecione...</option>
              <option v-for="f in funcionarios" :key="f.id" :value="f.id">{{ f.nome }}</option>
            </select>
          </div>
          <div>
            <label>{{ form.tipoMovimentacao === 'devolucao' ? 'Responsável que recebe *' : 'Responsável que entrega *' }}</label>
            <select v-model="form.responsavelEntregaId" @change="onRespChange">
              <option value="">Selecione...</option>
              <option v-for="f in funcionarios" :key="f.id" :value="f.id">{{ f.nome }}</option>
            </select>
          </div>
        </template>

        <template v-if="mostrarOS">
          <div class="full">
            <label>Ordem de Serviço *</label>
            <select v-model="form.ordemId" @change="onOrdemChange">
              <option value="">Selecione a OS...</option>
              <option v-for="o in ordens" :key="o.id" :value="o.id">
                OS {{ o.os }} — {{ o.proprietario || o.cliente || 'Sem proprietário' }}
              </option>
            </select>
          </div>
        </template>

        <div class="full">
          <label>Observação</label>
          <textarea v-model="form.observacao" placeholder="Observação opcional"></textarea>
        </div>
      </div>

      <div class="actions">
        <button class="primary" @click="salvar" :disabled="salvando">
          <span v-if="salvando"><span class="spinner"></span> Registrando...</span>
          <span v-else>Registrar</span>
        </button>
        <button class="secondary" @click="$emit('fechar')">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { carregarItens, registrarEntrada, registrarReserva, registrarDevolucao } from '../../services/estoque'
import { carregarFuncionarios } from '../../services/funcionarios'
import { carregarOrdens } from '../../services/ordens'

const props = defineProps({
  tipoInicial: { type: String, default: 'entrada' },
  itemInicial: { type: Object, default: null }
})
const emit = defineEmits(['fechar', 'salvo'])

const itens = ref([])
const funcionarios = ref([])
const ordens = ref([])
const salvando = ref(false)

const form = reactive({
  tipoMovimentacao: props.tipoInicial,
  itemId: props.itemInicial?.id || '',
  quantidade: 1,
  custoUnitario: props.itemInicial?.custoUnitario || 0,
  funcionarioId: '',
  funcionarioNome: '',
  responsavelEntregaId: '',
  responsavelEntregaNome: '',
  ordemId: '',
  ordemNumero: '',
  observacao: ''
})

const itemSelecionado = computed(() => itens.value.find(i => i.id === form.itemId))
const custoSugerido = computed(() => itemSelecionado.value?.custoUnitario?.toFixed(2) || '0.00')

const itensDisponiveis = computed(() => {
  if (form.tipoMovimentacao === 'entrada') return itens.value
  return itens.value
})

const mostrarOS = computed(() => {
  if (form.tipoMovimentacao === 'entrada') return false
  return itemSelecionado.value?.tipo === 'peca'
})

const tituloModal = computed(() => {
  const t = { entrada: 'Registrar Entrada', reserva: 'Registrar Reserva', devolucao: 'Registrar Devolução' }
  return t[form.tipoMovimentacao] || 'Movimentação'
})

function onTipoChange() {
  form.funcionarioId = ''
  form.funcionarioNome = ''
  form.responsavelEntregaId = ''
  form.responsavelEntregaNome = ''
  form.ordemId = ''
  form.ordemNumero = ''
}

function onItemChange() {
  const item = itemSelecionado.value
  if (item) form.custoUnitario = item.custoUnitario || 0
}

function onFuncChange() {
  const f = funcionarios.value.find(f => f.id === form.funcionarioId)
  form.funcionarioNome = f?.nome || ''
}

function onRespChange() {
  const f = funcionarios.value.find(f => f.id === form.responsavelEntregaId)
  form.responsavelEntregaNome = f?.nome || ''
}

function onOrdemChange() {
  const o = ordens.value.find(o => o.id === form.ordemId)
  form.ordemNumero = o?.os || ''
}

async function salvar() {
  if (!form.itemId) { alert('Selecione um item.'); return }
  if (!form.quantidade || form.quantidade <= 0) { alert('Informe a quantidade.'); return }

  const item = itemSelecionado.value
  if (!item) { alert('Item não encontrado.'); return }

  if (form.tipoMovimentacao !== 'entrada') {
    if (!form.funcionarioId) { alert('Selecione o funcionário.'); return }
    if (!form.responsavelEntregaId) { alert('Selecione o responsável.'); return }
    if (mostrarOS.value && !form.ordemId) { alert('Selecione a Ordem de Serviço.'); return }
  }

  salvando.value = true
  try {
    const dados = {
      itemId: form.itemId,
      itemNome: item.nome,
      tipoItem: item.tipo,
      quantidade: form.quantidade,
      custoUnitario: form.custoUnitario,
      funcionarioId: form.funcionarioId,
      funcionarioNome: form.funcionarioNome,
      responsavelEntregaId: form.responsavelEntregaId,
      responsavelEntregaNome: form.responsavelEntregaNome,
      ordemId: form.ordemId,
      ordemNumero: form.ordemNumero,
      observacao: form.observacao
    }

    if (form.tipoMovimentacao === 'entrada') {
      await registrarEntrada(dados)
    } else if (form.tipoMovimentacao === 'reserva') {
      await registrarReserva(dados)
    } else if (form.tipoMovimentacao === 'devolucao') {
      await registrarDevolucao(dados)
    }

    alert('Movimentação registrada com sucesso.')
    emit('salvo')
  } catch (e) {
    console.error('Erro na movimentação:', e)
    alert('Erro: ' + e.message)
  } finally {
    salvando.value = false
  }
}

onMounted(async () => {
  const [i, f, o] = await Promise.all([
    carregarItens(),
    carregarFuncionarios(true),
    carregarOrdens()
  ])
  itens.value = i
  funcionarios.value = f
  ordens.value = o
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 40px 16px;
  z-index: 1000;
  overflow-y: auto;
}

.modal-card {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 24px;
  width: 100%;
  max-width: 640px;
}

select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--line);
  border-radius: 8px;
  font-size: 14px;
  background: #fff;
}
</style>
