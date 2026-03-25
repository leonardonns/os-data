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
        <button v-if="!somenteLeitura" class="gallery-remove" @click.stop="$emit('remover', idx)" title="Remover foto">&times;</button>
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
  registroId: { type: String, default: '' },
  somenteLeitura: { type: Boolean, default: false }
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
  position: relative;
  display: inline-block;
}

.gallery-item img {
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}

.gallery-item img:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}

.gallery-remove {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: rgba(180, 35, 24, 0.85);
  color: #fff;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: background 0.2s, transform 0.15s;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}

.gallery-remove:hover {
  background: rgba(180, 35, 24, 1);
  transform: scale(1.15);
  opacity: 1;
}
</style>
