<template>
  <Teleport to="body">
    <div
      v-if="visivel"
      class="lightbox"
      @click="fechar"
      @keydown.escape="fechar"
      tabindex="0"
      ref="overlay"
    >
      <img :src="src" alt="Foto ampliada" />
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  visivel: { type: Boolean, default: false },
  src: { type: String, default: '' }
})

const emit = defineEmits(['fechar'])
const overlay = ref(null)

function fechar() {
  emit('fechar')
}

watch(() => props.visivel, async (val) => {
  if (val) {
    await nextTick()
    overlay.value?.focus()
  }
})
</script>

<style scoped>
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  outline: none;
}

.lightbox img {
  max-width: 92vw;
  max-height: 90vh;
  border-radius: 8px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
}
</style>
