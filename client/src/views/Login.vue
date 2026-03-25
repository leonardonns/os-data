<template>
  <div class="login-container">
    <div class="login-card">
      <img src="/logo-retifica-monteiro.png" alt="Retífica Monteiro" class="login-logo" />
      <h2>Entrar no Sistema</h2>

      <div v-if="erro" class="login-erro">{{ erro }}</div>

      <div class="login-campo">
        <label>Login</label>
        <input
          v-model="login"
          placeholder="Seu usuário"
          autocomplete="username"
          @keyup.enter="$refs.senhaInput?.focus()"
        />
      </div>

      <div class="login-campo">
        <label>Senha</label>
        <input
          ref="senhaInput"
          v-model="senha"
          type="password"
          placeholder="Sua senha"
          autocomplete="current-password"
          @keyup.enter="entrar"
        />
      </div>

      <button class="primary login-btn" @click="entrar" :disabled="entrando">
        <span v-if="entrando"><span class="spinner"></span> Entrando...</span>
        <span v-else>Entrar</span>
      </button>

      <RouterLink to="/" class="login-voltar">Voltar ao sistema sem login</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { login: fazerLogin } = useAuth()

const login = ref('')
const senha = ref('')
const erro = ref('')
const entrando = ref(false)
const senhaInput = ref(null)

async function entrar() {
  erro.value = ''

  if (!login.value.trim() || !senha.value) {
    erro.value = 'Preencha login e senha.'
    return
  }

  entrando.value = true
  try {
    await fazerLogin(login.value.trim(), senha.value)
    router.push('/')
  } catch (e) {
    erro.value = e.message
  } finally {
    entrando.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 60px 16px;
  min-height: 70vh;
}

.login-card {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 32px 28px;
  width: 100%;
  max-width: 380px;
  text-align: center;
}

.login-logo {
  width: 64px;
  height: 64px;
  border-radius: 10px;
  object-fit: contain;
  margin-bottom: 12px;
}

.login-card h2 {
  margin: 0 0 20px;
  font-size: 20px;
}

.login-campo {
  text-align: left;
  margin-bottom: 14px;
}

.login-erro {
  background: var(--danger-bg);
  color: var(--danger);
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  margin-bottom: 16px;
}

.login-btn {
  width: 100%;
  padding: 12px;
  font-size: 15px;
  margin-top: 4px;
}

.login-voltar {
  display: inline-block;
  margin-top: 16px;
  font-size: 13px;
  color: var(--muted);
  text-decoration: none;
}

.login-voltar:hover {
  color: var(--accent);
  text-decoration: underline;
}
</style>
