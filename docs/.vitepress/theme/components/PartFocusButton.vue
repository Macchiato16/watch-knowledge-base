<script setup lang="ts">
import type { PartId } from './watch-structure/partsData'

const props = defineProps<{
  part: PartId
  label?: string
}>()

function handleFocus() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(
    new CustomEvent('watch-structure:focus-part', {
      detail: { partId: props.part }
    })
  )
  const viewer = document.getElementById('watch-structure-viewer')
  if (viewer) {
    viewer.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}
</script>

<template>
  <button
    type="button"
    class="part-focus-inline-btn"
    title="回到上方 3D 模型并高亮聚焦此部件"
    @click="handleFocus"
  >
    <span class="part-focus-icon" aria-hidden="true">◎</span>
    <span>{{ label || '在 3D 演示中查看' }}</span>
  </button>
</template>

<style scoped>
.part-focus-inline-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: 8px;
  padding: 2px 10px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.6;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  border: 1px solid transparent;
  border-radius: 999px;
  cursor: pointer;
  vertical-align: middle;
  transition: background-color 0.18s ease, border-color 0.18s ease, transform 0.12s ease;
}

.part-focus-inline-btn:hover {
  border-color: var(--vp-c-brand-1);
}

.part-focus-inline-btn:active {
  transform: scale(0.97);
}

.part-focus-icon {
  font-size: 12px;
  line-height: 1;
}
</style>
