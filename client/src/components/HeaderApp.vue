<template>
  <header class="header">
    <div class="header-inner wrap">
      <div class="header-brand">
        <img src="/logo-retifica-monteiro.png" alt="Retífica Monteiro" class="header-logo" />
        <div>
          <h1 class="header-title">Retífica Monteiro</h1>
          <span class="header-subtitle">Sistema de Ordens de Serviço</span>
        </div>
      </div>

      <nav class="header-nav">
        <RouterLink to="/" class="nav-link" active-class="nav-link--active" :class="{ 'nav-link--active': $route.path === '/' }">
          Listagem
        </RouterLink>
        <RouterLink to="/nova" class="nav-link nav-link--cta" active-class="nav-link--active">
          + Nova OS
        </RouterLink>
        <RouterLink v-if="logado" to="/estoque" class="nav-link" active-class="nav-link--active">
          Estoque
        </RouterLink>
        <RouterLink v-if="logado && isAdmin" to="/funcionarios" class="nav-link" active-class="nav-link--active">
          Funcionários
        </RouterLink>
      </nav>

      <div class="header-user">
        <template v-if="logado">
          <span class="user-nome">{{ usuario.nome }}</span>
          <span v-if="isAdmin" class="user-badge">Admin</span>
          <button class="nav-link nav-link--logout" @click="sair">Sair</button>
        </template>
        <RouterLink v-else to="/login" class="nav-link nav-link--entrar">Entrar</RouterLink>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useAuth } from '../composables/useAuth'
import { useRouter } from 'vue-router'

const { usuario, logado, isAdmin, logout } = useAuth()
const router = useRouter()

function sair() {
  logout()
  router.push('/')
}
</script>

<style scoped>
.header {
  background: var(--accent);
  color: #fff;
  padding: 12px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-logo {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: contain;
  background: #fff;
  padding: 4px;
}

.header-title {
  font-size: 20px;
  margin: 0;
  color: #fff;
}

.header-subtitle {
  font-size: 12px;
  opacity: 0.8;
}

.header-nav {
  display: flex;
  gap: 8px;
}

.nav-link {
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
  transition: background 0.2s, color 0.2s;
  border: none;
  background: none;
  cursor: pointer;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

.nav-link--active {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.nav-link--cta {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

.nav-link--cta:hover {
  background: rgba(255, 255, 255, 0.25);
}

.nav-link--entrar {
  background: rgba(255, 255, 255, 0.15);
}

.nav-link--logout {
  font-size: 13px;
  padding: 6px 12px;
  opacity: 0.85;
}

.header-user {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-nome {
  font-size: 13px;
  font-weight: 600;
}

.user-badge {
  font-size: 10px;
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 999px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

@media (max-width: 700px) {
  .header-inner { flex-direction: column; align-items: flex-start; }
  .header-title { font-size: 18px; }
  .header-nav { flex-wrap: wrap; }
}
</style>
