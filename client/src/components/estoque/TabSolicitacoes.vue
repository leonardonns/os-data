<template>
  <div>
    <div v-if="!solicitacoes.length" class="card">
      <div class="small">Nenhuma solicitação pendente.</div>
    </div>

    <div v-for="(grupo, idx) in agrupadas" :key="idx" class="record">
      <div class="record-top">
        <div>
          <strong>{{ grupo.itemNome }}</strong>
          <span v-if="grupo.itemCodigo" class="small"> ({{ grupo.itemCodigo }})</span>
        </div>
        <div class="solic-status">
          <span v-if="grupo.disponivel > 0" class="badge badge-ok">Em estoque: {{ grupo.disponivel }}</span>
          <span v-else class="badge badge-alerta">Sem estoque</span>
        </div>
      </div>

      <div class="solic-os-list">
        <div v-for="s in grupo.solicitacoes" :key="s.ordemId + s.itemId" class="solic-os-row">
          <span>OS <b>{{ s.ordemNumero }}</b> — {{ s.quantidade }} {{ s.unidade || 'un' }}</span>
          <button
            v-if="grupo.disponivel >= s.quantidade"
            class="primary btn-sm"
            :disabled="reservando"
            @click="reservar(s, grupo)"
          >Reservar</button>
          <span v-else class="small">Aguardando estoque</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { registrarReserva, buscarItem } from '../../services/estoque'
import { atualizarOrdem, carregarOrdens } from '../../services/ordens'

const props = defineProps({
  solicitacoes: { type: Array, default: () => [] },
  itens: { type: Array, default: () => [] }
})
const emit = defineEmits(['atualizar'])

const reservando = ref(false)

const agrupadas = computed(() => {
  const map = {}
  for (const s of props.solicitacoes) {
    if (!map[s.itemId]) {
      const item = props.itens.find(i => i.id === s.itemId)
      map[s.itemId] = {
        itemId: s.itemId,
        itemNome: s.itemNome,
        itemCodigo: s.itemCodigo || '',
        disponivel: item?.quantidadeDisponivel ?? 0,
        solicitacoes: []
      }
    }
    map[s.itemId].solicitacoes.push(s)
  }
  return Object.values(map)
})

async function reservar(s, grupo) {
  if (!confirm(`Reservar ${s.quantidade} un de "${s.itemNome}" para OS ${s.ordemNumero}?`)) return

  reservando.value = true
  try {
    const item = await buscarItem(s.itemId)
    if (!item || (item.quantidadeDisponivel ?? 0) < s.quantidade) {
      alert('Estoque insuficiente para essa reserva.')
      return
    }

    const movId = await registrarReserva({
      itemId: s.itemId,
      itemNome: s.itemNome,
      tipoItem: 'peca',
      quantidade: s.quantidade,
      custoUnitario: item.custoUnitario || 0,
      ordemId: s.ordemId,
      ordemNumero: s.ordemNumero
    })

    const ordens = await carregarOrdens()
    const ordem = ordens.find(o => o.id === s.ordemId)
    if (ordem) {
      const pecas = (ordem.pecas || []).map(p => {
        if (p.itemId === s.itemId && p.status === 'solicitada') {
          return { ...p, status: 'reservada', movimentacaoId: movId }
        }
        return p
      })
      await atualizarOrdem(s.ordemId, { pecas })
    }

    alert('Peça reservada com sucesso para a OS.')
    emit('atualizar')
  } catch (e) {
    console.error('Erro ao reservar:', e)
    alert('Erro: ' + e.message)
  } finally {
    reservando.value = false
  }
}
</script>

<style scoped>
.solic-status { text-align: right; }

.badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
}
.badge-ok { background: var(--ok-bg); color: var(--ok); }
.badge-alerta { background: var(--danger-bg); color: var(--danger); }

.solic-os-list { margin-top: 10px; }
.solic-os-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 13px;
}
.solic-os-row:last-child { border-bottom: none; }

.btn-sm { padding: 6px 10px; font-size: 12px; }
</style>
