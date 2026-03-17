<template>
  <div class="status-bar">
    <div class="status-dot" :class="online ? 'dot-online' : 'dot-offline'"></div>
    <span class="small">{{ online ? 'Conectado ao Firebase' : 'Sem conexão' }}</span>
  </div>
</template>

<script setup>
defineProps({
  online: { type: Boolean, default: false }
})
</script>
