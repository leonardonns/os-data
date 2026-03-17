import { createRouter, createWebHistory } from 'vue-router'
import ListagemOS from '../views/ListagemOS.vue'
import CadastroOS from '../views/CadastroOS.vue'
import FichaTecnica from '../views/FichaTecnica.vue'

const routes = [
  { path: '/', name: 'listagem', component: ListagemOS },
  { path: '/nova', name: 'nova-os', component: CadastroOS },
  { path: '/editar/:id', name: 'editar-os', component: CadastroOS },
  { path: '/ficha-tecnica/:id', name: 'ficha-tecnica', component: FichaTecnica },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
