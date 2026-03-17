<template>
  <div class="gallery">
    <template v-if="fotos.length">
      <div v-for="(foto, idx) in fotos" :key="idx" class="gallery-item">
        <img
          :src="foto.url || foto.src"
          alt="Foto do serviço"
          loading="lazy"
          @click="abrirLightbox(foto.url || foto.src)"
        />
        <button class="danger" @click="$emit('remover', idx)">Remover</button>
      </div>
    </template>
    <div v-else class="small">Sem fotos cadastradas.</div>
  </div>

  <LightboxFoto
    :visivel="lightboxAberto"
    :src="lightboxSrc"
    @fechar="lightboxAberto = false"
  />
</template>

<script setup>
import { ref } from 'vue'
import LightboxFoto from './LightboxFoto.vue'

defineProps({
  fotos: { type: Array, default: () => [] },
  registroId: { type: String, default: '' }
})

defineEmits(['remover'])

const lightboxAberto = ref(false)
const lightboxSrc = ref('')

function abrirLightbox(src) {
  lightboxSrc.value = src
  lightboxAberto.value = true
}
</script>

<style scoped>
.gallery-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
}

.gallery-item img {
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}

.gallery-item img:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}
</style>
