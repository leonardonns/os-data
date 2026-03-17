<template>
  <div class="campo-medida">
    <label>{{ label }} <span v-if="unidade" class="unidade">({{ unidade }})</span></label>
    <input
      type="text"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder || '—'"
    />
  </div>
</template>

<script setup>
defineProps({
  label: String,
  modelValue: [String, Number],
  unidade: String,
  placeholder: String
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.campo-medida {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.campo-medida label {
  font-size: 13px;
  font-weight: 600;
}

.unidade {
  font-weight: 400;
  color: var(--muted);
}

.campo-medida input {
  width: 100%;
  padding: 7px 10px;
  border: 1px solid var(--line);
  border-radius: 6px;
  font-size: 13px;
}
</style>
