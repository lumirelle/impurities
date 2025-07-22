<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'

defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  images: {
    type: Array,
    default: () => [],
  },
  currentIndex: {
    type: Number,
    default: 0,
  },

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

  fitWidthRatio: {
    type: Number,
    default: 0.6,
  },
  fitHeightRatio: {
    type: Number,
    default: 0.6,
  },
})

const emit = defineEmits(['close', 'prev', 'next'])

const contentRef = ref(null)
const imageRef = ref(null)

const imageLoading = ref(false)
const imageError = ref(false)

const scale = ref(1)
const scaleType = ref('fit')

const rotation = ref(0)

const showToolbar = ref(true)
const hideTimer = ref(null)

const currentImage = computed(() => {
  return props.images[props.currentIndex] || { src: '', alt: '', title: '' }
})

const imageStyle = computed(() => {
  return {
    opacity: imageLoading.value ? 0 : 1,
    transform: `scale(${scale.value}) rotate(${rotation.value}deg)`,
  }
})

/**
 * Listen to the visible property, control the image viewer's display and initial behavior
 */
watch(visible, (newVal) => {
  if (newVal) {
    resetData()
    showToolbarAndRestartHideTimer()
    nextTick(() => {
      addKeydownListeners()
    })
  }
  else {
    removeKeydownListeners()
  }
})

watch(currentIndex, () => {
  resetData()
})

// Init

function resetData() {
  imageLoading.value = true
  imageError.value = false
  scale.value = 1
  scaleType.value = 'fit'
  rotation.value = 0
}

function addKeydownListeners() {
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('mousemove', handleMouseMove)
  const imageContainer = contentRef.value
  if (imageContainer) {
    imageContainer.addEventListener('mousedown', handleMouseDown)
    imageContainer.addEventListener('wheel', handleWheel)
  }
  else {
    console.error('😎 ~ ImageViewer.vue ~ addKeydownListeners ~ imageContainer:', imageContainer)
  }
}

function removeKeydownListeners() {
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('mousemove', handleMouseMove)
  const imageContainer = contentRef.value
  if (imageContainer) {
    imageContainer.removeEventListener('mousedown', handleMouseDown)
    imageContainer.removeEventListener('wheel', handleWheel)
  }
  else {
    console.error('😎 ~ ImageViewer.vue ~ removeKeydownListeners ~ imageContainer:', imageContainer)
  }
}

// Events

function handleImageLoad() {
  // Reset the scale after the image is loaded
  resetScale()
  imageLoading.value = false
  imageError.value = false
}

function handleImageError() {
  imageLoading.value = false
  imageError.value = true
}

// Scale

function resetScale() {
  if (scaleType.value === 'fit') {
    const image = imageRef.value
    const imageWidth = image.clientWidth
    const imageHeight = image.clientHeight

    const targetWidth = window.innerWidth * fitWidthRatio.value
    const targetHeight = window.innerHeight * fitHeightRatio.value

    const maxWidth = window.innerWidth * 0.8
    const maxHeight = window.innerHeight * 0.8

    scale.value = Math.min(targetWidth / imageWidth, targetHeight / imageHeight, maxWidth / imageWidth, maxHeight / imageHeight)
  }
  else {
    scale.value = 1
  }
}

// Toolbar auto hide management

function showToolbarAndRestartHideTimer() {
  showToolbar.value = true
  startHideTimer()
}

function startHideTimer() {
  clearHideTimer()
  hideTimer.value = setTimeout(() => {
    // showToolbar.value = false
  }, 2000) // 2秒后隐藏
}

function clearHideTimer() {
  if (hideTimer.value) {
    clearTimeout(hideTimer.value)
    hideTimer.value = null
  }
}

// Functions

function handleContentClick() {
  emit('close')
}

function zoomIn() {
  if (scaleMode.value === 'multiply') {
    scale.value = Math.min(scale.value * scaleRatio.value, maxScale.value)
  }
  else {
    scale.value = Math.min(scale.value + scaleStep.value, maxScale.value)
  }
}

function zoomOut() {
  if (scaleMode.value === 'multiply') {
    scale.value = Math.max(scale.value / scaleRatio.value, minScale.value)
  }
  else {
    scale.value = Math.max(scale.value - scaleStep.value, minScale.value)
  }
}

function handleScaleTypeChange(type) {
  scaleType.value = type
  resetScale()
}

function rotate() {
  rotation.value -= 90
}

// 键盘事件处理
function handleKeydown(event) {
  if (!visible.value)
    return

  switch (event.key) {
    case 'Escape':
      emit('close')
      break
    case 'ArrowLeft':
      if (currentIndex.value > 0) {
        emit('prev')
      }
      break
    case 'ArrowRight':
      if (currentIndex.value < images.value.length - 1) {
        emit('next')
      }
      break
    case 'ArrowUp':
      zoomIn()
      break
    case 'ArrowDown':
      zoomOut()
      break
    case 'r':
    case 'R':
      rotate()
      break
  }
}

function handleMouseMove() {
  // 显示工具栏并重新开始隐藏计时器
  showToolbarAndRestartHideTimer()
}

// 鼠标滚轮缩放
function handleWheel(event) {
  event.preventDefault()

  if (!event.ctrlKey) {
    return
  }

  if (event.deltaY < 0) {
    zoomIn()
  }
  else {
    zoomOut()
  }
}

function downloadImage() {
  const currentImage = images[currentIndex.value]
  if (currentImage) {
    fetch(currentImage.src)
      .then(res => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.download = currentImage.title || 'image'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
  }
}

onBeforeUnmount(() => {
  removeKeydownListeners()
  clearHideTimer()
})
</script>

<template>
  <div v-if="visible" class="image-viewer">
    <!-- 内容 -->
    <div ref="contentRef" class="image-viewer__content" @click="handleContentClick">
      <img
        v-show="!imageError"
        ref="imageRef"
        :key="currentImage.src"
        class="image-viewer__image"
        :src="currentImage.src"
        :alt="currentImage.alt"
        :style="imageStyle"
        @load="handleImageLoad"
        @error="handleImageError"
      >
      <!-- 加载中 -->
      <div v-if="imageLoading" class="image-viewer__loading">
        <div class="image-viewer__loading-spinner" />
      </div>
      <!-- 错误提示 -->
      <div v-else-if="imageError" class="image-viewer__error">
        <i class="el-icon-picture-outline" />
        <p>{{ $t('image-viewer.imageLoadFailed') }}</p>
      </div>
      <!-- 关闭按钮 -->
      <div class="image-viewer__close" :title="$t('image-viewer.close')" @click="$emit('close')">
        <img src="@/assets/images/image-viewer/close.svg" :alt="$t('image-viewer.close')">
      </div>
    </div>
    <!-- 工具栏 -->
    <div
      class="image-viewer__toolbar"
      :style="{ transform: showToolbar ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(100%)' }"
      @mouseenter="clearHideTimer"
      @mouseleave="startHideTimer"
    >
      <button
        class="image-viewer__toolbar-btn"
        :title="$t('image-viewer.prev')"
        :disabled="currentIndex === 0"
        @click="$emit('prev')"
      >
        <img src="@/assets/images/image-viewer/prev.svg" :alt="$t('image-viewer.prev')">
      </button>

      <div class="image-viewer__toolbar-info">
        {{ currentIndex + 1 }} / {{ images.length }}
      </div>

      <button
        class="image-viewer__toolbar-btn"
        :title="$t('image-viewer.next')"
        :disabled="currentIndex === images.length - 1"
        @click="$emit('next')"
      >
        <img src="@/assets/images/image-viewer/next.svg" :alt="$t('image-viewer.next')">
      </button>

      <div class="image-viewer__toolbar-divider" />

      <button class="image-viewer__toolbar-btn" :disabled="imageError || scale >= maxScale" :title="$t('image-viewer.zoomIn')" @click="zoomIn">
        <img src="@/assets/images/image-viewer/zoom-in.svg" :alt="$t('image-viewer.zoomIn')">
      </button>

      <div class="image-viewer__toolbar-info">
        {{ Math.round(scale * 100) }}%
      </div>

      <button class="image-viewer__toolbar-btn" :disabled="imageError || scale <= minScale" :title="$t('image-viewer.zoomOut')" @click="zoomOut">
        <img src="@/assets/images/image-viewer/zoom-out.svg" :alt="$t('image-viewer.zoomOut')">
      </button>

      <button class="image-viewer__toolbar-btn" :disabled="imageError" :title="scaleType === 'original' ? $t('image-viewer.fit') : $t('image-viewer.original')" @click="handleScaleTypeChange(scaleType === 'original' ? 'fit' : 'original')">
        <img
          :src="scaleType === 'original' ? require('@/assets/images/image-viewer/scale-type-fit.svg') : require('@/assets/images/image-viewer/scale-type-original.svg')"
          :alt="scaleType === 'original' ? $t('image-viewer.fit') : $t('image-viewer.original')"
        >
      </button>

      <div class="image-viewer__toolbar-divider" />

      <button class="image-viewer__toolbar-btn" :disabled="imageError" :title="$t('image-viewer.rotate')" @click="rotate">
        <img src="@/assets/images/image-viewer/rotate-left.svg" :alt="$t('image-viewer.rotate')">
      </button>

      <button class="image-viewer__toolbar-btn" :disabled="imageError" :title="$t('image-viewer.download')" @click="downloadImage">
        <img src="@/assets/images/image-viewer/download.svg" :alt="$t('image-viewer.download')">
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.image-viewer {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgb(0 0 0 / 80%);

  &__content {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
    cursor: zoom-out;
  }

  &__close {
    position: absolute;
    top: 24px;
    right: 24px;
    z-index: 1001;
    width: 26px;
    height: 26px;
    cursor: pointer;

    img {
      width: 100%;
      height: 100%;
    }
  }

  &__image {
    user-select: none;
  }

  &__loading {
    position: absolute;
    top: 50%;
    left: 50%;
    color: #fff;
    transform: translate(-50%, -50%);

    &__loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgb(255 255 255 / 30%);
      border-top: 3px solid #fff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  }

  &__error {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 16px;
    color: #fff;

    i {
      margin-bottom: 16px;
      font-size: 48px;
      opacity: 0.6;
    }
  }

  &__toolbar {
    position: fixed;
    bottom: 24px;
    left: 50%;
    z-index: 1001;
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: space-between;
    padding: 11px 20px;
    background-color: #131516;
    border-radius: 4px;
    transition: transform 0.3s ease-in-out;

    &-divider {
      width: 1px;
      height: 24px;
      margin: 0 9px;
      background-color: rgb(255 255 255 / 50%);

      @media screen and (width <= 768px) {
        margin: 0 4px;
      }
    }

    &-info {
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      color: #fff;
      white-space: nowrap;

      @media screen and (width <= 768px) {
        font-size: 12px;
        line-height: 18px;
      }
    }

    &-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      padding: 0;
      color: #fff;
      cursor: pointer;
      background: transparent;
      border: none;
      border-radius: 4px;
      transition: all 0.2s ease;

      img {
        width: 100%;
        height: 100%;
      }

      &:hover:not(:disabled) {
        background: rgb(255 255 255 / 20%);
        border-color: rgb(255 255 255 / 50%);
      }

      &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }

      @media screen and (width <= 768px) {
        width: 20px;
        height: 20px;
      }
    }
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

// 移动端适配
@media screen and (width <= 768px) {
  .image-viewer {
    &__toolbar {
      padding: 12px 16px;

      .image-info {
        .image-title {
          font-size: 14px;
        }

        .image-counter {
          font-size: 12px;
        }
      }

      .toolbar-btn {
        width: 36px;
        height: 36px;

        i {
          font-size: 14px;
        }
      }
    }
  }
}
</style>
