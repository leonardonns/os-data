<template>
  <div v-if="carregando" class="card">
    <span class="spinner"></span> Carregando dados...
  </div>

  <div v-else-if="!ordem">
    <div class="card">
      <div class="small">Registro não encontrado.</div>
      <div class="actions">
        <RouterLink to="/" class="btn secondary">Voltar</RouterLink>
      </div>
    </div>
  </div>

  <div v-else>
    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 8px">
        <div>
          <h2 style="margin: 0 0 6px">Visualizar Ordem de Serviço</h2>
          <div class="pill">OS {{ ordem.os }}</div>
        </div>
        <div class="actions" style="margin-top: 0">
          <RouterLink :to="`/editar/${registroId}`" class="btn primary">Editar</RouterLink>
          <RouterLink :to="`/ficha-tecnica/${registroId}`" class="btn ficha-btn">Ficha Técnica</RouterLink>
          <RouterLink to="/" class="btn secondary">Voltar</RouterLink>
        </div>
      </div>

      <div class="grid" style="margin-top: 16px">
        <div>
          <label>Número da OS</label>
          <input :value="ordem.os" disabled />
        </div>
        <div>
          <label>Nome Proprietário</label>
          <input :value="ordem.proprietario || ordem.cliente || ''" disabled />
        </div>
        <div>
          <label>Motor</label>
          <input :value="ordem.motor" disabled />
        </div>
        <div>
          <label>Chassi</label>
          <input :value="ordem.chassi" disabled />
        </div>
        <div>
          <label>Quilometragem Atual</label>
          <input :value="ordem.quilometragem" disabled />
        </div>
        <div>
          <label>Número do Bloco</label>
          <input :value="ordem.numeroBloco" disabled />
        </div>
        <div>
          <label>Placa</label>
          <input :value="ordem.placa" disabled />
        </div>
        <div>
          <label>Veículo</label>
          <input :value="ordem.veiculo" disabled />
        </div>
        <div class="full">
          <label>Serviço executado</label>
          <textarea :value="ordem.servico" disabled></textarea>
        </div>
      </div>

      <div class="view-timestamps small" style="margin-top: 14px">
        Criado em: {{ ordem.criadoEm || '-' }}
        <span v-if="ordem.atualizadoEm"> | Atualizado em: {{ ordem.atualizadoEm }}</span>
      </div>
    </div>

    <div v-if="fotos.length" class="card">
      <h2>Fotos</h2>
      <GaleriaFotos :fotos="fotos" :registro-id="registroId" :somente-leitura="true" />
    </div>

    <div v-if="arquivos.length" class="card">
      <h2>Arquivos</h2>
      <ListaArquivos :arquivos="arquivos" :somente-leitura="true" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import GaleriaFotos from '../components/GaleriaFotos.vue'
import ListaArquivos from '../components/ListaArquivos.vue'
import { carregarOrdens } from '../services/ordens'

const route = useRoute()
const router = useRouter()

const registroId = computed(() => route.params.id)
const ordem = ref(null)
const fotos = ref([])
const arquivos = ref([])
const carregando = ref(true)

async function carregarDados() {
  try {
    const ordens = await carregarOrdens()
    const reg = ordens.find(r => r.id === registroId.value)
    if (!reg) {
      ordem.value = null
      return
    }
    ordem.value = reg
    fotos.value = reg.fotos || []
    arquivos.value = reg.arquivos || []
  } catch (e) {
    console.error('Erro ao carregar registro:', e)
    alert('Erro ao carregar registro.')
    router.push('/')
  } finally {
    carregando.value = false
  }
}

onMounted(carregarDados)
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

input:disabled,
textarea:disabled {
  background: #f5f5f5;
  color: var(--text);
  cursor: default;
  opacity: 0.85;
}
</style>
