<template>
  <div v-if="arquivos.length" class="files-section">
    <h3>Arquivos anexos</h3>
    <div class="file-group">
      <div v-for="(arq, idx) in arquivos" :key="idx" class="file-item">
        <span class="file-icon">{{ iconeArquivo(arq.nome) }}</span>
        <a :href="arq.url" target="_blank" rel="noopener" :title="arq.nome">{{ arq.nome }}</a>
        <button class="danger" @click="$emit('remover', idx)">×</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  arquivos: { type: Array, default: () => [] }
})

defineEmits(['remover'])

function iconeArquivo(nome) {
  const ext = (nome || '').split('.').pop().toLowerCase()
  const map = {
    pdf: '📄', doc: '📝', docx: '📝', xls: '📊', xlsx: '📊',
    csv: '📊', txt: '📃', zip: '📦', rar: '📦', '7z': '📦'
  }
  return map[ext] || '📎'
}
</script>

<style scoped>
.files-section {
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid var(--line);
}

h3 {
  margin: 0 0 8px;
  font-size: 15px;
  color: var(--muted);
}

.file-group {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.file-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f8f9fc;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 13px;
  max-width: 300px;
}

.file-item a {
  color: var(--accent);
  text-decoration: none;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 160px;
  display: inline-block;
}

.file-item a:hover { text-decoration: underline; }

.file-icon { font-size: 20px; flex-shrink: 0; }

.file-item .danger { padding: 4px 8px; font-size: 11px; }

@media (max-width: 700px) {
  .file-item { max-width: 100%; }
}
</style>
