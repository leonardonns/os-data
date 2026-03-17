<template>
  <div class="campo-check">
    <span class="campo-check-label">{{ label }}</span>
    <div class="campo-check-opts">
      <label v-for="opt in opcoes" :key="opt.valor" class="opt-label">
        <input
          type="radio"
          :name="nome"
          :value="opt.valor"
          :checked="modelValue === opt.valor"
          @change="$emit('update:modelValue', opt.valor)"
        />
        <span :class="['opt-tag', modelValue === opt.valor ? (opt.cor || 'tag-default') : '']">
          {{ opt.texto }}
        </span>
      </label>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: String,
  modelValue: String,
  opcoes: {
    type: Array,
    default: () => [
      { valor: 'ok', texto: 'OK', cor: 'tag-ok' },
      { valor: 'nao_ok', texto: 'NÃO OK', cor: 'tag-danger' }
    ]
  }
})

defineEmits(['update:modelValue'])

const nome = computed(() => 'chk_' + props.label?.replace(/\s/g, '_') + '_' + Math.random().toString(36).slice(2, 6))
</script>

<style scoped>
.campo-check {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid var(--line);
  flex-wrap: wrap;
}

.campo-check-label {
  font-size: 14px;
  font-weight: 600;
  flex: 1;
  min-width: 180px;
}

.campo-check-opts {
  display: flex;
  gap: 6px;
}

.opt-label {
  cursor: pointer;
  font-weight: 400;
  margin: 0;
}

.opt-label input { display: none; }

.opt-tag {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 13px;
  border: 1px solid var(--line);
  background: #f8f8f8;
  transition: all 0.15s;
}

.tag-ok { background: var(--ok-bg); color: var(--ok); border-color: var(--ok); font-weight: 600; }
.tag-danger { background: var(--danger-bg); color: var(--danger); border-color: var(--danger); font-weight: 600; }
.tag-default { background: var(--accent); color: #fff; border-color: var(--accent); font-weight: 600; }
</style>
