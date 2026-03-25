<template>
  <div v-if="fotos.length" class="carrossel">
    <div class="carrossel-viewport">
      <button
        class="carrossel-btn carrossel-prev"
        @click.stop="anterior"
        v-show="totalPaginas > 1"
      >&lsaquo;</button>

      <div class="carrossel-track">
        <div
          v-for="(foto, i) in fotosVisiveis"
          :key="paginaAtual * POR_PAGINA + i"
          class="carrossel-slide"
        >
          <img
            :src="foto.url || foto.src"
            alt="Foto do serviço"
            class="carrossel-img"
            @click="abrirLightbox(foto.url || foto.src)"
          />
        </div>
      </div>

      <button
        class="carrossel-btn carrossel-next"
        @click.stop="proximo"
        v-show="totalPaginas > 1"
      >&rsaquo;</button>
    </div>

    <div class="carrossel-info">
      <span class="carrossel-counter">
        {{ inicioExibicao }}–{{ fimExibicao }} de {{ fotos.length }} foto(s)
      </span>
      <div class="carrossel-dots" v-if="totalPaginas > 1 && totalPaginas <= 12">
        <span
          v-for="p in totalPaginas"
          :key="p"
          class="carrossel-dot"
          :class="{ 'carrossel-dot--active': p - 1 === paginaAtual }"
          @click.stop="paginaAtual = p - 1"
        />
      </div>
    </div>

    <LightboxFoto
      :visivel="lightboxAberto"
      :src="lightboxSrc"
      @fechar="lightboxAberto = false"
    />
  </div>
  <div v-else class="small">Sem fotos cadastradas.</div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import LightboxFoto from './LightboxFoto.vue'

const POR_PAGINA = 5

const props = defineProps({
  fotos: { type: Array, default: () => [] }
})

const paginaAtual = ref(0)
const lightboxAberto = ref(false)
const lightboxSrc = ref('')

const totalPaginas = computed(() => Math.ceil(props.fotos.length / POR_PAGINA))

const fotosVisiveis = computed(() => {
  const inicio = paginaAtual.value * POR_PAGINA
  return props.fotos.slice(inicio, inicio + POR_PAGINA)
})

const inicioExibicao = computed(() => paginaAtual.value * POR_PAGINA + 1)
const fimExibicao = computed(() => Math.min((paginaAtual.value + 1) * POR_PAGINA, props.fotos.length))

function anterior() {
  paginaAtual.value = paginaAtual.value <= 0 ? totalPaginas.value - 1 : paginaAtual.value - 1
}

function proximo() {
  paginaAtual.value = paginaAtual.value >= totalPaginas.value - 1 ? 0 : paginaAtual.value + 1
}

function abrirLightbox(src) {
  lightboxSrc.value = src
  lightboxAberto.value = true
}

function precarregar(pagina) {
  if (pagina < 0 || pagina >= totalPaginas.value) return
  const inicio = pagina * POR_PAGINA
  const fatia = props.fotos.slice(inicio, inicio + POR_PAGINA)
  fatia.forEach(f => {
    const img = new Image()
    img.src = f.url || f.src
  })
}

watch(paginaAtual, (p) => {
  if (p < totalPaginas.value - 1) precarregar(p + 1)
  if (p > 0) precarregar(p - 1)
})

onMounted(() => {
  if (totalPaginas.value > 1) precarregar(1)
})
</script>

<style scoped>
.carrossel {
  margin-top: 12px;
}

.carrossel-viewport {
  position: relative;
  display: flex;
  align-items: center;
  border-radius: 10px;
  overflow: hidden;
  background: #fafafa;
  border: 1px solid var(--line);
}

.carrossel-track {
  display: flex;
  width: 100%;
  gap: 6px;
}

.carrossel-slide {
  flex: 1 1 0;
  min-width: 0;
  overflow: hidden;
}

.carrossel-img {
  width: 100%;
  height: 130px;
  object-fit: cover;
  display: block;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.15s;
}

.carrossel-img:hover {
  opacity: 0.88;
  transform: scale(1.03);
}

.carrossel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  transition: background 0.2s;
  padding: 0;
}

.carrossel-btn:hover {
  background: rgba(0, 0, 0, 0.75);
  opacity: 1;
}

.carrossel-prev { left: 6px; }
.carrossel-next { right: 6px; }

.carrossel-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
}

.carrossel-counter {
  font-size: 12px;
  color: var(--muted);
  font-weight: 600;
}

.carrossel-dots {
  display: flex;
  gap: 5px;
}

.carrossel-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--line);
  cursor: pointer;
  transition: background 0.2s;
}

.carrossel-dot--active {
  background: var(--accent);
}
</style>
