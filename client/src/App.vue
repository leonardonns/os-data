<template>
  <HeaderApp />
  <main class="wrap">
    <RouterView />
  </main>
</template>

<script setup>
import { onMounted } from 'vue'
import HeaderApp from './components/HeaderApp.vue'
import { useAuth } from './composables/useAuth'
import { seedAdmin } from './services/auth'

const { inicializar } = useAuth()
onMounted(() => inicializar())

window.seedAdmin = seedAdmin
</script>
