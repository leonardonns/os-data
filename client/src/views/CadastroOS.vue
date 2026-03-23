<template>
  <div>
    <div class="card" :class="{ loading: salvando }">
      <h2>{{ modoEdicao ? 'Editar Ordem de Serviço' : 'Nova Ordem de Serviço' }}</h2>
      <div v-if="modoEdicao" class="pill" style="margin-bottom: 12px">
        Editando OS {{ form.os }}
      </div>

      <div class="grid">
        <div>
          <label for="os">Número da OS</label>
          <input id="os" v-model="form.os" placeholder="Ex.: 1543" />
        </div>
        <div>
          <label for="proprietario">Nome Proprietário</label>
          <input id="proprietario" v-model="form.proprietario" placeholder="Nome do proprietário" />
        </div>
        <div>
          <label for="motor">Motor</label>
          <input id="motor" v-model="form.motor" placeholder="Ex.: OM457" />
        </div>
        <div>
          <label for="chassi">Chassi</label>
          <input id="chassi" v-model="form.chassi" placeholder="Número do chassi" />
        </div>
        <div>
          <label for="quilometragem">Quilometragem Atual</label>
          <input id="quilometragem" v-model="form.quilometragem" placeholder="Ex.: 350.000 km" />
        </div>
        <div>
          <label for="numeroBloco">Número do Bloco</label>
          <input id="numeroBloco" v-model="form.numeroBloco" placeholder="Número do bloco" />
        </div>
        <div>
          <label for="placa">Placa</label>
          <input id="placa" v-model="form.placa" placeholder="Ex.: ABC-1D23" />
        </div>
        <div>
          <label for="veiculo">Veículo</label>
          <input id="veiculo" v-model="form.veiculo" placeholder="Ex.: MB Axor 3131" />
        </div>
        <div class="full">
          <label for="servico">Serviço executado</label>
          <textarea id="servico" v-model="form.servico" placeholder="Descreva o serviço executado"></textarea>
        </div>
        <div class="full">
          <label for="fotos">Adicionar fotos</label>
          <input type="file" id="fotos" ref="inputFotos" multiple accept="image/*" />
          <div class="small">
            {{ modoEdicao ? 'As fotos antigas continuam e as novas são adicionadas.' : 'Selecione uma ou mais fotos do serviço.' }}
          </div>
        </div>
        <div class="full">
          <label for="arquivos">Adicionar arquivos</label>
          <input type="file" id="arquivos" ref="inputArquivos" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.zip,.rar,.7z" />
          <div class="small">
            PDF, Word, Excel, TXT, ZIP e outros. {{ modoEdicao ? 'Os arquivos antigos continuam.' : '' }}
          </div>
        </div>
        <div v-if="statusUpload.ativo" class="full">
          <div class="upload-progress">
            <div class="upload-progress-bar" :style="{ width: statusUpload.progresso + '%' }"></div>
          </div>
          <div class="upload-status">
            <span v-if="statusUpload.fase === 'comprimindo'">Comprimindo foto {{ statusUpload.atual }} de {{ statusUpload.total }}...</span>
            <span v-else-if="statusUpload.fase === 'enviando'">Enviando {{ statusUpload.atual }} de {{ statusUpload.total }}... {{ Math.round(statusUpload.progresso) }}%</span>
            <span v-else-if="statusUpload.fase === 'salvando'">Salvando dados...</span>
          </div>
        </div>
      </div>

      <div class="actions">
        <button class="primary" @click="salvar" :disabled="salvando">
          <span v-if="salvando"><span class="spinner"></span>Salvando...</span>
          <span v-else>{{ modoEdicao ? 'Salvar alterações' : 'Salvar OS' }}</span>
        </button>
        <RouterLink v-if="modoEdicao" :to="`/ficha-tecnica/${registroId}`" class="btn ficha-btn">Ficha Técnica</RouterLink>
        <RouterLink to="/" class="btn secondary">Cancelar</RouterLink>
      </div>
    </div>

    <div v-if="modoEdicao && fotosExistentes.length" class="card">
      <h2>Fotos atuais</h2>
      <GaleriaFotos
        :fotos="fotosExistentes"
        :registro-id="registroId"
        @remover="removerFotoExistente"
      />
    </div>

    <div v-if="modoEdicao && arquivosExistentes.length" class="card">
      <h2>Arquivos atuais</h2>
      <ListaArquivos
        :arquivos="arquivosExistentes"
        @remover="removerArquivoExistente"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import GaleriaFotos from '../components/GaleriaFotos.vue'
import ListaArquivos from '../components/ListaArquivos.vue'
import { carregarOrdens, criarOrdem, atualizarOrdem, gerarId } from '../services/ordens'
import { uploadFotosEmLote, uploadArquivosEmLote, excluirFoto } from '../services/storage'

const route = useRoute()
const router = useRouter()
const inputFotos = ref(null)
const inputArquivos = ref(null)

const registroId = computed(() => route.params.id || '')
const modoEdicao = computed(() => !!route.params.id)

const form = reactive({
  os: '',
  proprietario: '',
  motor: '',
  chassi: '',
  quilometragem: '',
  numeroBloco: '',
  placa: '',
  veiculo: '',
  servico: ''
})

const fotosExistentes = ref([])
const arquivosExistentes = ref([])
const salvando = ref(false)
const statusUpload = reactive({
  ativo: false,
  atual: 0,
  total: 0,
  progresso: 0,
  fase: ''
})

async function carregarDadosEdicao() {
  if (!modoEdicao.value) return
  try {
    const ordens = await carregarOrdens()
    const reg = ordens.find(r => r.id === registroId.value)
    if (!reg) {
      alert('Registro não encontrado.')
      router.push('/')
      return
    }
    form.os = reg.os || ''
    form.proprietario = reg.proprietario || reg.cliente || ''
    form.motor = reg.motor || ''
    form.chassi = reg.chassi || ''
    form.quilometragem = reg.quilometragem || ''
    form.numeroBloco = reg.numeroBloco || ''
    form.placa = reg.placa || ''
    form.veiculo = reg.veiculo || ''
    form.servico = reg.servico || ''
    fotosExistentes.value = reg.fotos || []
    arquivosExistentes.value = reg.arquivos || []
  } catch (e) {
    console.error('Erro ao carregar registro:', e)
    alert('Erro ao carregar registro.')
  }
}

async function salvar() {
  if (salvando.value) return
  if (!form.os.trim()) {
    alert('Informe o número da OS.')
    return
  }

  salvando.value = true
  statusUpload.ativo = false

  try {
    const id = registroId.value || gerarId()
    const fotoFiles = inputFotos.value?.files || []
    const arquivoFiles = inputArquivos.value?.files || []

    let novasFotos = []
    let errosFotos = []
    if (fotoFiles.length > 0) {
      statusUpload.ativo = true
      const resultFotos = await uploadFotosEmLote(id, fotoFiles, (status) => {
        statusUpload.atual = status.atual
        statusUpload.total = status.total
        statusUpload.progresso = status.progresso
        statusUpload.fase = status.fase
      })
      novasFotos = resultFotos.resultados
      errosFotos = resultFotos.erros
    }

    let novosArquivos = []
    let errosArquivos = []
    if (arquivoFiles.length > 0) {
      statusUpload.ativo = true
      const resultArquivos = await uploadArquivosEmLote(id, arquivoFiles, (status) => {
        statusUpload.atual = status.atual
        statusUpload.total = status.total
        statusUpload.progresso = status.progresso
        statusUpload.fase = status.fase
      })
      novosArquivos = resultArquivos.resultados
      errosArquivos = resultArquivos.erros
    }

    statusUpload.fase = 'salvando'

    const dados = {
      os: form.os.trim(),
      proprietario: form.proprietario.trim(),
      motor: form.motor.trim(),
      chassi: form.chassi.trim(),
      quilometragem: form.quilometragem.trim(),
      numeroBloco: form.numeroBloco.trim(),
      placa: form.placa.trim(),
      veiculo: form.veiculo.trim(),
      servico: form.servico.trim()
    }

    if (modoEdicao.value) {
      dados.fotos = [...fotosExistentes.value, ...novasFotos]
      dados.arquivos = [...arquivosExistentes.value, ...novosArquivos]
      await atualizarOrdem(id, dados)
    } else {
      dados.fotos = novasFotos
      dados.arquivos = novosArquivos
      await criarOrdem(id, dados)
    }

    const totalErros = [...errosFotos, ...errosArquivos]
    if (totalErros.length > 0) {
      const nomes = totalErros.map(e => e.nome).join(', ')
      alert(`Salvo com sucesso, mas ${totalErros.length} arquivo(s) falharam: ${nomes}`)
    } else {
      alert(modoEdicao.value ? 'Registro atualizado com sucesso.' : 'OS salva com sucesso.')
    }

    router.push('/')
  } catch (e) {
    console.error('Erro ao salvar:', e)
    alert('Erro ao salvar: ' + e.message)
  } finally {
    salvando.value = false
    statusUpload.ativo = false
    statusUpload.progresso = 0
  }
}

async function removerFotoExistente(idx) {
  if (!confirm('Deseja remover esta foto?')) return
  const foto = fotosExistentes.value[idx]
  await excluirFoto(foto.path)

  const novas = [...fotosExistentes.value]
  novas.splice(idx, 1)
  fotosExistentes.value = novas

  await atualizarOrdem(registroId.value, { fotos: novas })
}

async function removerArquivoExistente(idx) {
  if (!confirm('Deseja remover este arquivo?')) return
  const arq = arquivosExistentes.value[idx]
  await excluirFoto(arq.path)

  const novos = [...arquivosExistentes.value]
  novos.splice(idx, 1)
  arquivosExistentes.value = novos

  await atualizarOrdem(registroId.value, { arquivos: novos })
}

onMounted(carregarDadosEdicao)
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

.upload-status {
  font-size: 12px;
  color: var(--muted);
  margin-top: 4px;
}

.ficha-btn {
  background: #e8f5e9;
  color: #137333;
}
</style>
