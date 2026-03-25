<template>
  <div class="modal-overlay" @click.self="$emit('fechar')">
    <div class="modal-card">
      <h2>{{ editando ? 'Editar Funcionário' : 'Novo Funcionário' }}</h2>

      <div class="grid">
        <div>
          <label>Nome *</label>
          <input v-model="form.nome" placeholder="Nome completo" />
        </div>
        <div>
          <label>Cargo</label>
          <input v-model="form.cargo" placeholder="Ex: Mecânico, Torneiro..." />
        </div>
      </div>

      <div class="actions">
        <button class="primary" @click="salvar" :disabled="salvando">
          <span v-if="salvando"><span class="spinner"></span> Salvando...</span>
          <span v-else>{{ editando ? 'Salvar Alterações' : 'Cadastrar' }}</span>
        </button>
        <button class="secondary" @click="$emit('fechar')">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { gerarIdFuncionario, criarFuncionario, atualizarFuncionario } from '../../services/funcionarios'

const props = defineProps({
  funcionario: { type: Object, default: null }
})
const emit = defineEmits(['fechar', 'salvo'])

const editando = !!props.funcionario
const salvando = ref(false)

const form = reactive({
  nome: props.funcionario?.nome || '',
  cargo: props.funcionario?.cargo || ''
})

async function salvar() {
  if (!form.nome.trim()) {
    alert('Informe o nome do funcionário.')
    return
  }

  salvando.value = true
  try {
    if (editando) {
      await atualizarFuncionario(props.funcionario.id, { nome: form.nome.trim(), cargo: form.cargo.trim() })
    } else {
      const id = gerarIdFuncionario()
      await criarFuncionario(id, { nome: form.nome.trim(), cargo: form.cargo.trim() })
    }
    alert(editando ? 'Funcionário atualizado.' : 'Funcionário cadastrado.')
    emit('salvo')
  } catch (e) {
    console.error('Erro ao salvar funcionário:', e)
    alert('Erro: ' + e.message)
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
  max-width: 480px;
}
</style>
