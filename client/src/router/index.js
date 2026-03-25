import { createRouter, createWebHistory } from 'vue-router'
import ListagemOS from '../views/ListagemOS.vue'
import CadastroOS from '../views/CadastroOS.vue'
import VisualizarOS from '../views/VisualizarOS.vue'
import FichaTecnica from '../views/FichaTecnica.vue'
import Estoque from '../views/Estoque.vue'
import Funcionarios from '../views/Funcionarios.vue'

const routes = [
  { path: '/', name: 'listagem', component: ListagemOS },
  { path: '/nova', name: 'nova-os', component: CadastroOS },
  { path: '/editar/:id', name: 'editar-os', component: CadastroOS },
  { path: '/visualizar/:id', name: 'visualizar-os', component: VisualizarOS },
  { path: '/ficha-tecnica/:id', name: 'ficha-tecnica', component: FichaTecnica },
  { path: '/estoque', name: 'estoque', component: Estoque },
  { path: '/funcionarios', name: 'funcionarios', component: Funcionarios },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
