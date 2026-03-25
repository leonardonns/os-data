import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const ListagemOS = () => import('../views/ListagemOS.vue')
const CadastroOS = () => import('../views/CadastroOS.vue')
const VisualizarOS = () => import('../views/VisualizarOS.vue')
const FichaTecnica = () => import('../views/FichaTecnica.vue')
const Estoque = () => import('../views/Estoque.vue')
const Funcionarios = () => import('../views/Funcionarios.vue')
const Login = () => import('../views/Login.vue')

const routes = [
  { path: '/', name: 'listagem', component: ListagemOS, meta: { perfis: [] } },
  { path: '/nova', name: 'nova-os', component: CadastroOS, meta: { perfis: [] } },
  { path: '/editar/:id', name: 'editar-os', component: CadastroOS, meta: { perfis: [] } },
  { path: '/visualizar/:id', name: 'visualizar-os', component: VisualizarOS, meta: { perfis: [] } },
  { path: '/ficha-tecnica/:id', name: 'ficha-tecnica', component: FichaTecnica, meta: { perfis: [] } },
  { path: '/estoque', name: 'estoque', component: Estoque, meta: { requerLogin: true } },
  { path: '/funcionarios', name: 'funcionarios', component: Funcionarios, meta: { requerLogin: true, perfis: ['Administrador'] } },
  { path: '/login', name: 'login', component: Login, meta: { publica: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const { logado, temAlgumPerfil } = useAuth()

  if (to.meta.requerLogin && !logado.value) {
    return { name: 'login' }
  }

  if (to.meta.perfis?.length && !temAlgumPerfil(to.meta.perfis)) {
    return { name: 'listagem' }
  }
})

export default router
