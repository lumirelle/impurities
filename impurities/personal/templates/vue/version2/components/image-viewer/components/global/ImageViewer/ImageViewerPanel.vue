<script>
export default {
  name: 'ImageViewerPanel',

  props: {
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

    scaleRatio: {
      type: Number,
      default: 1.15,
    },
    maxScale: {
      type: Number,
      default: 5,
    },
    minScale: {
      type: Number,
      default: 0.1,
    },
    targetWidth: {
      type: Number,
      default: 600,
    },
    targetHeight: {
      type: Number,
      default: 400,
    },
  },

  data() {
    return {
      imageLoading: false,
      imageError: false,

      scale: 1,
      scaleType: 'fit',

      rotation: 0,

      showToolbar: true,
      hideTimer: null,
    }
  },

  computed: {
    currentImage() {
      return this.images[this.currentIndex] || { src: '', alt: '', title: '' }
    },

    imageContainerStyle() {
      return {
        transform: `scale(${this.scale})`,
      }
    },
    imageStyle() {
      return {
        transform: `scale(${this.scale}) rotate(${this.rotation}deg)`,
      }
    },
  },

  watch: {
    /**
     * Listen to the visible property, control the image viewer's display and initial behavior
     */
    visible(newVal) {
      if (newVal) {
        this.resetData()
        this.showToolbarAndRestartHideTimer()
        this.$nextTick(() => {
          this.addKeydownListeners()
        })
      }
      else {
        this.removeKeydownListeners()
      }
    },

    currentIndex() {
      this.resetData()
    },
  },

  beforeUnmount() {
    this.removeKeydownListeners()
    this.clearHideTimer()
  },

  methods: {
    // Init

    resetData() {
      this.imageLoading = true
      this.imageError = false
      this.scale = 1
      this.scaleType = 'fit'
      this.rotation = 0
    },

    addKeydownListeners() {
      document.addEventListener('keydown', this.handleKeydown)
      document.addEventListener('mousemove', this.handleMouseMove)
      const imageContainer = this.$refs.contentRef
      if (imageContainer) {
        imageContainer.addEventListener('mousedown', this.handleMouseDown)
        imageContainer.addEventListener('wheel', this.handleWheel)
      }
      else {
        console.error('😎 ~ ImageViewer.vue ~ addKeydownListeners ~ imageContainer:', imageContainer)
      }
    },

    removeKeydownListeners() {
      document.removeEventListener('keydown', this.handleKeydown)
      document.removeEventListener('mousemove', this.handleMouseMove)
      const imageContainer = this.$refs.contentRef
      if (imageContainer) {
        imageContainer.removeEventListener('mousedown', this.handleMouseDown)
        imageContainer.removeEventListener('wheel', this.handleWheel)
      }
      else {
        console.error('😎 ~ ImageViewer.vue ~ removeKeydownListeners ~ imageContainer:', imageContainer)
      }
    },

    // Events

    handleImageLoad() {
      this.imageLoading = false
      this.imageError = false
      // Reset the scale after the image is loaded
      this.resetScale()
    },

    handleImageError() {
      this.imageLoading = false
      this.imageError = true
    },

    // Scale

    resetScale() {
      if (this.scaleType === 'fit') {
        const image = this.$refs.imageRef
        const imageWidth = image.clientWidth
        const imageHeight = image.clientHeight

        const targetWidth = this.targetWidth
        const targetHeight = this.targetHeight

        const maxWidth = window.innerWidth * 0.8
        const maxHeight = window.innerHeight * 0.8

        const scale = Math.min(targetWidth / imageWidth, targetHeight / imageHeight, maxWidth / imageWidth, maxHeight / imageHeight)

        this.scale = scale
      }
      else {
        this.scale = 1
      }
    },

    // Toolbar auto hide management

    showToolbarAndRestartHideTimer() {
      this.showToolbar = true
      this.startHideTimer()
    },

    startHideTimer() {
      this.clearHideTimer()
      this.hideTimer = setTimeout(() => {
        // this.showToolbar = false
      }, 2000) // 2秒后隐藏
    },

    clearHideTimer() {
      if (this.hideTimer) {
        clearTimeout(this.hideTimer)
        this.hideTimer = null
      }
    },

    // Functions

    handleContentClick() {
      this.$emit('close')
    },

    zoomIn() {
      this.scale = Math.min(this.scale * this.scaleRatio, this.maxScale)
    },

    zoomOut() {
      this.scale = Math.max(this.scale / this.scaleRatio, this.minScale)
    },

    handleScaleTypeChange(type) {
      this.scaleType = type
      this.resetScale()
    },

    rotate() {
      this.rotation += 90
    },

    // 键盘事件处理
    handleKeydown(event) {
      if (!this.visible)
        return

      switch (event.key) {
        case 'Escape':
          this.$emit('close')
          break
        case 'ArrowLeft':
          if (this.currentIndex > 0) {
            this.$emit('prev')
          }
          break
        case 'ArrowRight':
          if (this.currentIndex < this.images.length - 1) {
            this.$emit('next')
          }
          break
        case 'ArrowUp':
          this.zoomIn()
          break
        case 'ArrowDown':
          this.zoomOut()
          break
        case 'r':
        case 'R':
          this.rotate()
          break
      }
    },

    handleMouseMove() {
      // 显示工具栏并重新开始隐藏计时器
      this.showToolbarAndRestartHideTimer()
    },

    // 鼠标滚轮缩放
    handleWheel(event) {
      event.preventDefault()

      if (event.deltaY < 0) {
        this.zoomIn()
      }
      else {
        this.zoomOut()
      }
    },

    downloadImage() {
      const currentImage = this.images[this.currentIndex]
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
    },
  },
}
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
    transition: transform 0.2s ease-in-out;
    animation: opacity 0.3s ease-in-out;
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

@keyframes opacity {
  0% { opacity: 0; }
  100% { opacity: 1; }
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
