<template>
  <div>
    <div class="card">
      <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center; justify-content: space-between">
        <h2 style="margin: 0">Ordens de Serviço</h2>
        <StatusConexao :online="online" />
      </div>
    </div>

    <div class="card">
      <h2>Buscar registros</h2>
      <input
        v-model="busca"
        class="search"
        placeholder="Buscar por OS, proprietário, motor, placa, chassi ou veículo"
      />
      <div class="small" style="margin-top: 8px">
        {{ filtrados.length }} registro(s) encontrado(s)
      </div>
    </div>

    <div v-if="carregando" class="card">
      <span class="spinner"></span> Carregando registros...
    </div>

    <template v-else>
      <div v-if="!filtrados.length" class="card">
        <div class="small">Nenhum registro encontrado.</div>
      </div>

      <CardOS
        v-for="ordem in filtrados"
        :key="ordem.id"
        :ordem="ordem"
        @excluir="handleExcluir"
        @remover-arquivo="handleRemoverArquivo"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import CardOS from '../components/CardOS.vue'
import StatusConexao from '../components/StatusConexao.vue'
import { carregarOrdens, excluirOrdem, atualizarOrdem } from '../services/ordens'
import { excluirFoto } from '../services/storage'

const dados = ref([])
const busca = ref('')
const online = ref(false)
const carregando = ref(true)

const filtrados = computed(() => {
  const q = busca.value.toLowerCase().trim()
  if (!q) return dados.value
  return dados.value.filter(r =>
    (r.os || '').toLowerCase().includes(q) ||
    (r.proprietario || r.cliente || '').toLowerCase().includes(q) ||
    (r.motor || '').toLowerCase().includes(q) ||
    (r.chassi || '').toLowerCase().includes(q) ||
    (r.placa || '').toLowerCase().includes(q) ||
    (r.numeroBloco || '').toLowerCase().includes(q) ||
    (r.veiculo || '').toLowerCase().includes(q)
  )
})

async function fetchDados() {
  carregando.value = true
  try {
    dados.value = await carregarOrdens()
    online.value = true
  } catch (e) {
    console.error('Erro ao carregar:', e)
    online.value = false
  } finally {
    carregando.value = false
  }
}

async function handleExcluir(id) {
  const reg = dados.value.find(r => r.id === id)
  if (!reg) return
  if (!confirm(`Deseja excluir a OS ${reg.os}?`)) return

  for (const foto of (reg.fotos || [])) {
    await excluirFoto(foto.path)
  }
  for (const arq of (reg.arquivos || [])) {
    await excluirFoto(arq.path)
  }

  await excluirOrdem(id)
  await fetchDados()
}

async function handleRemoverArquivo(registroId, indiceArquivo) {
  if (!confirm('Deseja remover este arquivo?')) return
  const reg = dados.value.find(r => r.id === registroId)
  if (!reg) return

  const arq = reg.arquivos[indiceArquivo]
  await excluirFoto(arq.path)

  const novosArquivos = [...reg.arquivos]
  novosArquivos.splice(indiceArquivo, 1)

  await atualizarOrdem(registroId, { arquivos: novosArquivos })
  await fetchDados()
}

onMounted(fetchDados)
</script>
