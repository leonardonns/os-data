<template>
  <div>
    <div class="card ficha-header">
      <div class="ficha-header-top">
        <div>
          <h2>Ficha Técnica</h2>
          <div class="sub">Análise Metrológica e Dimensional</div>
        </div>
        <RouterLink to="/" class="btn secondary">← Voltar</RouterLink>
      </div>
      <div v-if="ordemDados" class="ficha-info">
        <div><b>OS</b>{{ ordemDados.os }}</div>
        <div><b>Proprietário</b>{{ ordemDados.proprietario }}</div>
        <div><b>Motor</b>{{ ordemDados.motor }}</div>
        <div><b>Placa</b>{{ ordemDados.placa }}</div>
      </div>

      <div class="ficha-extra grid2">
        <div>
          <label for="oficina">Oficina responsável</label>
          <input id="oficina" v-model="ficha.oficina" placeholder="Nome da oficina" />
        </div>
        <div>
          <label for="tecnico">Técnico responsável</label>
          <input id="tecnico" v-model="ficha.tecnico" placeholder="Nome do técnico" />
        </div>
      </div>
    </div>

    <div class="card">
      <div class="tabs-nav">
        <button
          v-for="(tab, idx) in abas"
          :key="tab.id"
          class="tab-btn"
          :class="{ active: abaAtiva === idx }"
          @click="abaAtiva = idx"
        >
          <span class="tab-num">{{ idx + 1 }}</span>
          {{ tab.nome }}
        </button>
      </div>

      <div class="tab-panel" v-if="fichaCarregada">
        <TabExamesPreliminares
          v-if="abaAtiva === 0"
          :modelValue="ficha.examesPreliminares || {}"
          @update:modelValue="v => ficha.examesPreliminares = v"
        />
        <TabCabecoteMotor
          v-if="abaAtiva === 1"
          :modelValue="ficha.cabecoteMotor || {}"
          @update:modelValue="v => ficha.cabecoteMotor = v"
        />
        <TabComandosValvulas
          v-if="abaAtiva === 2"
          :modelValue="ficha.comandosValvulas || {}"
          @update:modelValue="v => ficha.comandosValvulas = v"
        />
        <TabBloco
          v-if="abaAtiva === 3"
          :modelValue="ficha.bloco || {}"
          @update:modelValue="v => ficha.bloco = v"
        />
        <TabPistao
          v-if="abaAtiva === 4"
          :modelValue="ficha.pistao || {}"
          @update:modelValue="v => ficha.pistao = v"
        />
        <TabBiela
          v-if="abaAtiva === 5"
          :modelValue="ficha.biela || {}"
          @update:modelValue="v => ficha.biela = v"
        />
        <TabBronzinas
          v-if="abaAtiva === 6"
          :modelValue="ficha.bronzinas || {}"
          @update:modelValue="v => ficha.bronzinas = v"
        />
        <TabVirabrequim
          v-if="abaAtiva === 7"
          :modelValue="ficha.virabrequim || {}"
          @update:modelValue="v => ficha.virabrequim = v"
        />
      </div>

      <div v-else class="loading-box">
        <span class="spinner"></span> Carregando ficha...
      </div>
    </div>

    <div class="card actions-bar">
      <div class="actions">
        <button class="primary" @click="salvarFichaHandler" :disabled="salvando">
          <span v-if="salvando"><span class="spinner"></span>Salvando...</span>
          <span v-else>Salvar Ficha Técnica</span>
        </button>
        <button class="secondary" @click="navAba(-1)" :disabled="abaAtiva === 0">← Anterior</button>
        <button class="secondary" @click="navAba(1)" :disabled="abaAtiva === abas.length - 1">Próxima →</button>
      </div>
      <div v-if="ultimoSalvo" class="small">Último salvamento: {{ ultimoSalvo }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { carregarOrdens } from '../services/ordens'
import { carregarFicha, salvarFicha, fichaVazia } from '../services/fichaTecnica'

import TabExamesPreliminares from '../components/ficha-tecnica/TabExamesPreliminares.vue'
import TabCabecoteMotor from '../components/ficha-tecnica/TabCabecoteMotor.vue'
import TabComandosValvulas from '../components/ficha-tecnica/TabComandosValvulas.vue'
import TabBloco from '../components/ficha-tecnica/TabBloco.vue'
import TabPistao from '../components/ficha-tecnica/TabPistao.vue'
import TabBiela from '../components/ficha-tecnica/TabBiela.vue'
import TabBronzinas from '../components/ficha-tecnica/TabBronzinas.vue'
import TabVirabrequim from '../components/ficha-tecnica/TabVirabrequim.vue'

const route = useRoute()
const router = useRouter()
const ordemId = route.params.id

const abas = [
  { id: 'exames', nome: 'Exames Preliminares' },
  { id: 'cabecote', nome: 'Cabeçote do Motor' },
  { id: 'comandos', nome: 'Comandos de Válvulas' },
  { id: 'bloco', nome: 'Bloco' },
  { id: 'pistao', nome: 'Pistão' },
  { id: 'biela', nome: 'Biela' },
  { id: 'bronzinas', nome: 'Bronzinas' },
  { id: 'virabrequim', nome: 'Virabrequim' }
]

const abaAtiva = ref(0)
const fichaCarregada = ref(false)
const salvando = ref(false)
const ultimoSalvo = ref('')
const ordemDados = ref(null)

const ficha = reactive({
  oficina: '',
  tecnico: '',
  ...fichaVazia()
})

function navAba(dir) {
  const prox = abaAtiva.value + dir
  if (prox >= 0 && prox < abas.length) abaAtiva.value = prox
}

async function carregarDados() {
  try {
    const ordens = await carregarOrdens()
    const ordem = ordens.find(o => o.id === ordemId)
    if (!ordem) {
      alert('Ordem de serviço não encontrada.')
      router.push('/')
      return
    }
    ordemDados.value = ordem

    const dados = await carregarFicha(ordemId)
    if (dados) {
      Object.assign(ficha, dados)
      ultimoSalvo.value = dados.atualizadoEm || ''
    }
  } catch (e) {
    console.error('Erro ao carregar ficha:', e)
    alert('Erro ao carregar ficha técnica.')
  } finally {
    fichaCarregada.value = true
  }
}

async function salvarFichaHandler() {
  if (salvando.value) return
  salvando.value = true
  try {
    const dados = { ...ficha }
    await salvarFicha(ordemId, dados)
    ultimoSalvo.value = new Date().toLocaleString('pt-BR')
    alert('Ficha técnica salva com sucesso!')
  } catch (e) {
    console.error('Erro ao salvar ficha:', e)
    alert('Erro ao salvar: ' + e.message)
  } finally {
    salvando.value = false
  }
}

onMounted(carregarDados)
</script>

<style scoped>
.ficha-header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  flex-wrap: wrap;
}

.ficha-info {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 8px 16px;
  margin-top: 12px;
  padding: 10px;
  background: #f7f8fb;
  border-radius: 8px;
  font-size: 14px;
}

.ficha-info b {
  display: block;
  font-size: 11px;
  color: var(--muted);
  margin-bottom: 2px;
}

.ficha-extra {
  margin-top: 12px;
}

.grid2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.tabs-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  border-bottom: 2px solid var(--line);
  padding-bottom: 0;
  margin-bottom: 16px;
}

.tab-btn {
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  border: none;
  border-bottom: 3px solid transparent;
  background: none;
  color: var(--muted);
  cursor: pointer;
  white-space: nowrap;
  border-radius: 6px 6px 0 0;
  transition: all 0.15s;
}

.tab-btn:hover {
  background: #f0f2f8;
  color: var(--text);
}

.tab-btn.active {
  color: var(--accent);
  border-bottom-color: var(--accent);
  background: #eef2ff;
}

.tab-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--line);
  color: var(--muted);
  font-size: 11px;
  font-weight: 700;
  margin-right: 4px;
}

.tab-btn.active .tab-num {
  background: var(--accent);
  color: #fff;
}

.tab-panel {
  min-height: 200px;
}

.loading-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 40px 0;
  justify-content: center;
  color: var(--muted);
}

.actions-bar {
  position: sticky;
  bottom: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

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

@media (max-width: 700px) {
  .grid2 { grid-template-columns: 1fr; }

  .tabs-nav {
    gap: 2px;
  }

  .tab-btn {
    font-size: 12px;
    padding: 6px 8px;
  }
}
</style>
