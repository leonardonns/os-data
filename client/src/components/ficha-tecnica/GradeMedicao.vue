<template>
  <div class="grade-medicao">
    <h4 v-if="titulo">{{ titulo }}</h4>
    <div class="grade-grid" :style="{ gridTemplateColumns: `repeat(${itens.length}, 1fr)` }">
      <div v-for="item in itens" :key="item" class="grade-item">
        <label>{{ item }}</label>
        <input
          type="text"
          :value="(modelValue || {})[String(item)] || ''"
          @input="atualizar(String(item), $event.target.value)"
          placeholder="—"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  titulo: String,
  itens: Array,
  modelValue: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['update:modelValue'])

function atualizar(chave, valor) {
  emit('update:modelValue', { ...props.modelValue, [chave]: valor })
}
</script>

<style scoped>
.grade-medicao {
  margin: 14px 0;
}

.grade-medicao h4 {
  margin: 0 0 8px;
  font-size: 14px;
}

.grade-grid {
  display: grid;
  gap: 8px;
}

.grade-item label {
  font-size: 12px;
  font-weight: 700;
  color: var(--muted);
  margin-bottom: 3px;
}

.grade-item input {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid var(--line);
  border-radius: 6px;
  font-size: 13px;
  text-align: center;
}

@media (max-width: 700px) {
  .grade-grid {
    grid-template-columns: repeat(3, 1fr) !important;
  }
}
</style>
