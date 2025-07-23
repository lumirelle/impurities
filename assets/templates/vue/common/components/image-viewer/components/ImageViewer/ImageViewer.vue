<script setup>
/**
 * Image Viewer
 *
 * @example
 * Just wrap the rich text content with `ImageViewer` component, and the images will be displayed in a modal when clicked.
 *
 * ```html
 * <ImageViewer>
 *   <!-- Some rich text content rendered by `v-html` and contains images -->
 *   <section class="article-content" v-html="article.content" />
 * </ImageViewer>
 * ```
 */

import ImageViewerPanel from './ImageViewerPanel.vue'

defineProps({
  /**
   * Scale mode
   * - multiply: Multiply/divide the scale by the "scale ratio" when zooming in/out
   * - addition: Add/subtract the "scale step" to the scale when zooming in/out
   */
  scaleMode: {
    type: String,
    default: 'addition',
    validator: (value) => {
      return ['multiply', 'addition'].includes(value)
    },
  },
  scaleRatio: {
    type: Number,
    default: 1.15,
  },
  scaleStep: {
    type: Number,
    default: 0.1,
  },

  maxScale: {
    type: Number,
    default: 5,
  },
  minScale: {
    type: Number,
    default: 0.1,
  },

  /**
   * Ratio to the window width when the scale type is "fit" (Fit to screen)
   */
  fitWidthRatio: {
    type: Number,
    default: 0.6,
  },
  /**
   * Ratio to the window height when the scale type is "fit" (Fit to screen)
   */
  fitHeightRatio: {
    type: Number,
    default: 0.6,
  },
})

const panelVisible = ref(false)

const images = ref([])
const currentImageIndex = ref(0)

function init() {
  // 事件委托：监听整个wrapper的点击事件
  content.value.addEventListener('click', handleImageClick)
}
function cleanup() {
  content.value.removeEventListener('click', handleImageClick)
}
function handleImageClick(event) {
  if (event.target.tagName === 'IMG') {
    // 收集所有图片
    const images = Array.from(this.$refs.content.querySelectorAll('img'))
      .map(img => ({
        src: img.src || '',
        alt: img.alt || '',
        title: img.title || img.alt || '',
      }))

    if (images.length === 0)
      return

    // 找到当前图片索引
    const currentIndex = images.findIndex(img => img.src === event.target.src)

    if (currentIndex >= 0) {
      openImageViewer(images, currentIndex)
    }
  }
}

function openImageViewer(imagesParam, index) {
  images.value = imagesParam
  currentImageIndex.value = index
  panelVisible.value = true
  // 阻止页面滚动
  document.body.style.overflow = 'hidden'
}
function closeImageViewer() {
  panelVisible.value = false
  // 恢复页面滚动
  document.body.style.overflow = ''
}
function prevImage() {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}
function nextImage() {
  if (currentImageIndex.value < images.value.length - 1) {
    currentImageIndex.value++
  }
}

onMounted(() => {
  init()
})
onBeforeUnmount(() => {
  cleanup()
})

defineExpose({
  openImageViewer,
  closeImageViewer,
  prevImage,
  nextImage,
})
</script>

<template>
  <div class="image-viewer-wrapper">
    <div ref="content" class="image-viewer-wrapper__content">
      <slot />
    </div>
    <ImageViewerPanel
      :visible="panelVisible"
      :images="images"
      :current-index="currentImageIndex"
      :scale-mode="scaleMode"
      :scale-ratio="scaleRatio"
      :scale-step="scaleStep"
      :max-scale="maxScale"
      :min-scale="minScale"
      @close="closeImageViewer"
      @prev="prevImage"
      @next="nextImage"
    />
  </div>
</template>

<style lang="scss" scoped>
.image-viewer-wrapper {
  position: relative;

  &__content {
    :deep(img) {
      cursor: zoom-in;
    }
  }
}
</style>
