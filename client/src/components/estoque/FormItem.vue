<template>
  <div class="modal-overlay" @click.self="$emit('fechar')">
    <div class="modal-card">
      <h2>{{ editando ? 'Editar Item' : 'Novo Item de Estoque' }}</h2>

      <div class="grid">
        <div>
          <label>Nome *</label>
          <input v-model="form.nome" placeholder="Nome principal do item" />
        </div>
        <div>
          <label>Código</label>
          <input v-model="form.codigo" placeholder="Ex: BRZ-STD-001" />
        </div>
        <div>
          <label>Tipo *</label>
          <select v-model="form.tipo">
            <option value="epi">EPI</option>
            <option value="ferramenta">Ferramenta</option>
            <option value="peca">Peça</option>
          </select>
        </div>
        <div>
          <label>Subcategoria</label>
          <input v-model="form.subcategoria" placeholder="Ex: luvas, bronzinas..." />
        </div>
        <div>
          <label>Unidade</label>
          <select v-model="form.unidade">
            <option value="un">Unidade (un)</option>
            <option value="par">Par</option>
            <option value="jg">Jogo (jg)</option>
            <option value="kg">Quilograma (kg)</option>
            <option value="m">Metro (m)</option>
            <option value="l">Litro (l)</option>
            <option value="cx">Caixa (cx)</option>
            <option value="pc">Pacote (pc)</option>
          </select>
        </div>
        <div>
          <label>Estoque Mínimo</label>
          <input v-model.number="form.estoqueMinimo" type="number" min="0" placeholder="0" />
        </div>
        <div>
          <label>Custo Unitário (R$)</label>
          <input v-model.number="form.custoUnitario" type="number" min="0" step="0.01" placeholder="0.00" />
        </div>
        <div>
          <label>Localização</label>
          <input v-model="form.localizacao" placeholder="Ex: Prateleira A3, Gaveta 12" />
        </div>
        <div>
          <label>Fornecedor</label>
          <input v-model="form.fornecedorNome" placeholder="Nome do fornecedor" />
        </div>
        <div>
          <label>Contato Fornecedor</label>
          <input v-model="form.fornecedorContato" placeholder="Telefone ou email" />
        </div>
        <div class="full">
          <label>Descrição</label>
          <textarea v-model="form.descricao" placeholder="Descrição do item"></textarea>
        </div>

        <div class="full">
          <label>Nomes Alternativos (aliases)</label>
          <div class="tags-input">
            <span v-for="(alias, i) in form.aliases" :key="i" class="tag">
              {{ alias }}
              <button type="button" class="tag-remove" @click="removerAlias(i)">&times;</button>
            </span>
            <input
              v-model="novoAlias"
              placeholder="Digite e pressione Enter"
              @keydown.enter.prevent="adicionarAlias"
            />
          </div>
        </div>

        <div v-if="form.tipo === 'peca'" class="full">
          <label>Compatibilidade (motores/veículos)</label>
          <div class="tags-input">
            <span v-for="(comp, i) in form.compatibilidade" :key="i" class="tag">
              {{ comp }}
              <button type="button" class="tag-remove" @click="removerCompatibilidade(i)">&times;</button>
            </span>
            <input
              v-model="novaCompatibilidade"
              placeholder="Ex: Motor MWM 4.10 — Enter para adicionar"
              @keydown.enter.prevent="adicionarCompatibilidade"
            />
          </div>
        </div>

        <div class="full">
          <label>Foto do Item</label>
          <div v-if="fotoAtual" class="foto-preview">
            <img :src="fotoAtual.url" alt="Foto do item" />
            <button type="button" class="danger btn-sm" @click="removerFoto">Remover foto</button>
          </div>
          <input type="file" ref="inputFoto" accept="image/*" />
        </div>
      </div>

      <div class="actions">
        <button class="primary" @click="salvar" :disabled="salvando">
          <span v-if="salvando"><span class="spinner"></span> Salvando...</span>
          <span v-else>{{ editando ? 'Salvar Alterações' : 'Cadastrar Item' }}</span>
        </button>
        <button class="secondary" @click="$emit('fechar')">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { gerarIdItem, criarItem, atualizarItem, uploadFotoItem, excluirFotoItem } from '../../services/estoque'

const props = defineProps({
  item: { type: Object, default: null }
})
const emit = defineEmits(['fechar', 'salvo'])

const editando = !!props.item
const inputFoto = ref(null)
const salvando = ref(false)
const novoAlias = ref('')
const novaCompatibilidade = ref('')
const fotoAtual = ref(props.item?.foto || null)

const form = reactive({
  nome: props.item?.nome || '',
  codigo: props.item?.codigo || '',
  aliases: [...(props.item?.aliases || [])],
  tipo: props.item?.tipo || 'peca',
  subcategoria: props.item?.subcategoria || '',
  descricao: props.item?.descricao || '',
  unidade: props.item?.unidade || 'un',
  estoqueMinimo: props.item?.estoqueMinimo || 0,
  custoUnitario: props.item?.custoUnitario || 0,
  localizacao: props.item?.localizacao || '',
  fornecedorNome: props.item?.fornecedorNome || '',
  fornecedorContato: props.item?.fornecedorContato || '',
  compatibilidade: [...(props.item?.compatibilidade || [])]
})

function adicionarAlias() {
  const val = novoAlias.value.trim()
  if (val && !form.aliases.includes(val)) {
    form.aliases.push(val)
  }
  novoAlias.value = ''
}

function removerAlias(i) {
  form.aliases.splice(i, 1)
}

function adicionarCompatibilidade() {
  const val = novaCompatibilidade.value.trim()
  if (val && !form.compatibilidade.includes(val)) {
    form.compatibilidade.push(val)
  }
  novaCompatibilidade.value = ''
}

function removerCompatibilidade(i) {
  form.compatibilidade.splice(i, 1)
}

function removerFoto() {
  fotoAtual.value = null
}

async function salvar() {
  if (!form.nome.trim()) {
    alert('Informe o nome do item.')
    return
  }
  if (!form.tipo) {
    alert('Selecione o tipo do item.')
    return
  }

  salvando.value = true
  try {
    const id = props.item?.id || gerarIdItem()

    let foto = fotoAtual.value
    const fotoFile = inputFoto.value?.files?.[0]

    if (fotoFile) {
      if (props.item?.foto?.path) {
        await excluirFotoItem(props.item.foto.path)
      }
      foto = await uploadFotoItem(id, fotoFile)
    } else if (!fotoAtual.value && props.item?.foto?.path) {
      await excluirFotoItem(props.item.foto.path)
      foto = null
    }

    const dados = { ...form, foto }

    if (editando) {
      await atualizarItem(id, dados)
    } else {
      dados.quantidade = 0
      dados.quantidadeDisponivel = 0
      await criarItem(id, dados)
    }

    alert(editando ? 'Item atualizado com sucesso.' : 'Item cadastrado com sucesso.')
    emit('salvo')
  } catch (e) {
    console.error('Erro ao salvar item:', e)
    alert('Erro ao salvar: ' + e.message)
  } finally {
    salvando.value = false
  }
}
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
  max-width: 720px;
}

select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--line);
  border-radius: 8px;
  font-size: 14px;
  background: #fff;
}

.tags-input {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 8px;
  border: 1px solid var(--line);
  border-radius: 8px;
  min-height: 42px;
  align-items: center;
}

.tags-input input {
  border: none;
  outline: none;
  flex: 1;
  min-width: 140px;
  padding: 4px;
  font-size: 14px;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: #eef2ff;
  color: #334155;
  border-radius: 999px;
  font-size: 12px;
}

.tag-remove {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #64748b;
  padding: 0 2px;
  line-height: 1;
}

.tag-remove:hover { color: var(--danger); }

.foto-preview {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.foto-preview img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid var(--line);
}

.btn-sm {
  padding: 6px 10px;
  font-size: 12px;
}
</style>
