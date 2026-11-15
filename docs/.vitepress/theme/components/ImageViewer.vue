<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const visible = ref(false)
const currentSrc = ref('')
const currentAlt = ref('')
const zoomed = ref(false)

let previousOverflow = ''

function openViewer(img: HTMLImageElement) {
  currentSrc.value = img.currentSrc || img.src
  currentAlt.value = img.alt || ''
  zoomed.value = false
  visible.value = true
  previousOverflow = document.documentElement.style.overflow
  document.documentElement.style.overflow = 'hidden'
}

function closeViewer() {
  visible.value = false
  zoomed.value = false
  document.documentElement.style.overflow = previousOverflow
}

function toggleZoom() {
  zoomed.value = !zoomed.value
}

function onDocumentClick(event: MouseEvent) {
  const target = event.target as HTMLElement | null
  if (!target) return
  if (target.closest('.iv-overlay')) return

  const img = target.closest('.vp-doc img') as HTMLImageElement | null
  if (!img || img.dataset.noZoom !== undefined) return

  event.preventDefault()
  openViewer(img)
}

function onKeyDown(event: KeyboardEvent) {
  if (visible.value && event.key === 'Escape') {
    closeViewer()
  }
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onKeyDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeyDown)
  if (visible.value) {
    document.documentElement.style.overflow = previousOverflow
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="iv-fade">
      <div
        v-if="visible"
        class="iv-overlay"
        role="dialog"
        aria-modal="true"
        :aria-label="currentAlt || '图片高清预览'"
        @click="closeViewer"
      >
        <div class="iv-toolbar" @click.stop>
          <button
            type="button"
            class="iv-btn"
            :aria-label="zoomed ? '还原大小' : '放大查看'"
            @click="toggleZoom"
          >
            {{ zoomed ? '还原' : '放大' }}
          </button>
          <button
            type="button"
            class="iv-btn iv-close"
            aria-label="关闭预览"
            @click="closeViewer"
          >
            ✕
          </button>
        </div>

        <div class="iv-stage" :class="{ 'is-zoomed': zoomed }" @click.self="closeViewer">
          <img
            :src="currentSrc"
            :alt="currentAlt"
            class="iv-img"
            :class="{ 'is-zoomed': zoomed }"
            @click.stop="toggleZoom"
          />
        </div>

        <div v-if="currentAlt" class="iv-caption" @click.stop>
          {{ currentAlt }}
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.iv-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  background: rgba(10, 14, 23, 0.9);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.iv-toolbar {
  position: fixed;
  top: max(14px, env(safe-area-inset-top));
  right: max(14px, env(safe-area-inset-right));
  z-index: 10001;
  display: flex;
  align-items: center;
  gap: 8px;
}

.iv-btn {
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(15, 23, 42, 0.72);
  color: #f8fafc;
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 13px;
  line-height: 1.4;
  cursor: pointer;
  transition: background-color 0.18s ease, border-color 0.18s ease;
}

.iv-btn:hover {
  background: rgba(30, 41, 59, 0.92);
  border-color: rgba(255, 255, 255, 0.45);
}

.iv-close {
  padding: 6px 12px;
  font-weight: 600;
}

.iv-stage {
  flex: 1;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 56px 16px 64px;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-x pan-y pinch-zoom;
}

.iv-stage.is-zoomed {
  align-items: flex-start;
  justify-content: flex-start;
}

.iv-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 6px;
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.48);
  cursor: zoom-in;
  user-select: none;
  -webkit-user-drag: none;
  transition: transform 0.2s ease;
}

.iv-img.is-zoomed {
  max-width: none;
  max-height: none;
  width: min(1600px, 180vw);
  margin: auto;
  cursor: zoom-out;
}

.iv-caption {
  position: fixed;
  left: 50%;
  bottom: max(14px, env(safe-area-inset-bottom));
  transform: translateX(-50%);
  max-width: min(92vw, 760px);
  padding: 8px 16px;
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.78);
  color: #f1f5f9;
  font-size: 13px;
  line-height: 1.5;
  text-align: center;
  z-index: 10001;
}

.iv-fade-enter-active,
.iv-fade-leave-active {
  transition: opacity 0.18s ease;
}

.iv-fade-enter-from,
.iv-fade-leave-to {
  opacity: 0;
}
</style>
