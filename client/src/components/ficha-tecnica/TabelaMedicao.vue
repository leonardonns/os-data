<template>
  <div class="tabela-medicao">
    <h4 v-if="titulo">{{ titulo }}</h4>
    <div class="tabela-scroll">
      <table>
        <thead>
          <tr>
            <th class="th-idx">#</th>
            <th v-for="col in colunas" :key="col">{{ col }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="linha in linhas" :key="linha">
            <td class="td-idx">{{ linha }}</td>
            <td v-for="col in colunas" :key="col">
              <input
                type="text"
                :value="getCelula(linha, col)"
                @input="setCelula(linha, col, $event.target.value)"
                placeholder="—"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  titulo: String,
  colunas: Array,
  linhas: Array,
  modelValue: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['update:modelValue'])

function chave(linha, col) {
  return `${linha}_${col}`.replace(/[°/\s]/g, '')
}

function getCelula(linha, col) {
  return props.modelValue?.[chave(linha, col)] || ''
}

function setCelula(linha, col, valor) {
  const novo = { ...props.modelValue, [chave(linha, col)]: valor }
  emit('update:modelValue', novo)
}
</script>

<style scoped>
.tabela-medicao {
  margin: 14px 0;
}

.tabela-medicao h4 {
  margin: 0 0 8px;
  font-size: 14px;
  color: var(--text);
}

.tabela-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  min-width: 400px;
}

th, td {
  border: 1px solid var(--line);
  padding: 4px 6px;
  text-align: center;
}

th {
  background: #f0f2f8;
  font-weight: 600;
  font-size: 12px;
  white-space: nowrap;
}

.th-idx, .td-idx {
  width: 36px;
  font-weight: 700;
  background: #f7f8fb;
}

td input {
  width: 100%;
  min-width: 48px;
  border: none;
  background: transparent;
  text-align: center;
  font-size: 13px;
  padding: 3px 2px;
  outline: none;
}

td input:focus {
  background: #eef2ff;
  border-radius: 3px;
}
</style>
