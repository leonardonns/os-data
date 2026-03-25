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

      <h3 class="secao-titulo">Acesso ao Sistema</h3>

      <div class="grid">
        <div>
          <label>Login</label>
          <input v-model="form.login" placeholder="Nome de usuário" autocomplete="off" />
        </div>
        <div>
          <label>{{ editando ? 'Nova Senha (deixe vazio para manter)' : 'Senha' }}</label>
          <input v-model="form.senha" type="password" placeholder="••••••" autocomplete="new-password" />
        </div>
      </div>

      <div class="full" style="margin-top: 12px">
        <label>Perfis</label>
        <div class="perfis-grid">
          <label v-for="p in PERFIS_DISPONIVEIS" :key="p" class="perfil-check">
            <input type="checkbox" :value="p" v-model="form.perfis" />
            <span>{{ p }}</span>
          </label>
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
import { gerarIdFuncionario, criarFuncionario, atualizarFuncionario, buscarFuncionarioPorLogin } from '../../services/funcionarios'
import { hashSenha, PERFIS_DISPONIVEIS } from '../../services/auth'

const props = defineProps({
  funcionario: { type: Object, default: null }
})
const emit = defineEmits(['fechar', 'salvo'])

const editando = !!props.funcionario
const salvando = ref(false)

const form = reactive({
  nome: props.funcionario?.nome || '',
  cargo: props.funcionario?.cargo || '',
  login: props.funcionario?.login || '',
  senha: '',
  perfis: props.funcionario?.perfis ? [...props.funcionario.perfis] : []
})

async function salvar() {
  if (!form.nome.trim()) {
    alert('Informe o nome do funcionário.')
    return
  }

  if (form.login.trim()) {
    const existente = await buscarFuncionarioPorLogin(form.login.trim())
    if (existente && existente.id !== props.funcionario?.id) {
      alert('Esse login já está em uso por outro funcionário.')
      return
    }
  }

  salvando.value = true
  try {
    const dados = {
      nome: form.nome.trim(),
      cargo: form.cargo.trim(),
      login: form.login.trim(),
      perfis: form.perfis
    }

    if (form.senha) {
      dados.senha = await hashSenha(form.senha)
    }

    if (editando) {
      await atualizarFuncionario(props.funcionario.id, dados)
    } else {
      if (!dados.senha) dados.senha = ''
      const id = gerarIdFuncionario()
      await criarFuncionario(id, dados)
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
  max-width: 540px;
}

.secao-titulo {
  font-size: 15px;
  margin: 18px 0 8px;
  padding-top: 14px;
  border-top: 1px solid var(--line);
}

.perfis-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 16px;
}

.perfil-check {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 400;
  font-size: 13px;
  cursor: pointer;
  margin: 0;
}

.perfil-check input[type="checkbox"] {
  width: auto;
  margin: 0;
}
</style>
