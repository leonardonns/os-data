import { ref, computed } from 'vue'
import { fazerLogin, fazerLogout, recuperarSessao, lerSessaoLocal } from '../services/auth'

const usuario = ref(null)

export function useAuth() {
  const logado = computed(() => !!usuario.value)
  const isAdmin = computed(() => (usuario.value?.perfis || []).includes('Administrador'))

  function temPerfil(perfil) {
    return (usuario.value?.perfis || []).includes(perfil)
  }

  function temAlgumPerfil(perfis) {
    if (!perfis || perfis.length === 0) return true
    return perfis.some(p => temPerfil(p))
  }

  async function inicializar() {
    const local = lerSessaoLocal()
    if (local) usuario.value = local
    try {
      const sessao = await recuperarSessao()
      usuario.value = sessao
    } catch {
      usuario.value = null
    }
  }

  async function login(loginStr, senha) {
    const sessao = await fazerLogin(loginStr, senha)
    usuario.value = sessao
    return sessao
  }

  function logout() {
    fazerLogout()
    usuario.value = null
  }

  return { usuario, logado, isAdmin, temPerfil, temAlgumPerfil, inicializar, login, logout }
}
