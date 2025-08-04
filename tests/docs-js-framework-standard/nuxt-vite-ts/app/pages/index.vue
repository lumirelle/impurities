<i18n lang="yaml">
en:
  i18n block hello: Hello I18n Block!
zh-CN:
  i18n block hello: 你好，I18n 块！
</i18n>

<script setup lang="ts">
import { useMouse } from '@vueuse/core'
import { computed } from 'vue'

const { x, y } = useMouse()

const { t, locale, locales } = useI18n({
  useScope: 'local',
})
const switchLocalePath = useSwitchLocalePath()

const availableLocales = computed(() => {
  return locales.value.filter(i => i.code !== locale.value)
})
</script>

<template>
  <div>
    <h1>Test</h1>
    <div class="test-scss">
      Test SCSS
      <div class="test-block">
        Test Block
      </div>
      <div class="test-block2">
        Test Block 2
      </div>
    </div>
    <div class="test-mouse">
      pos: {{ x }}, {{ y }}
    </div>
    <div class="test-i18n">
      <NuxtLink v-for="locale in availableLocales" :key="locale.code" :to="switchLocalePath(locale.code)">
        {{ locale.name }}
      </NuxtLink>
      <span>
        {{ t('hello') }}
        {{ t('i18n block hello') }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.test-scss {
  color: red;
  font-weight: 700px;
  font-size: 40px;
  .test-block {
    color: blue;
    font-weight: 600px;
    font-size: 30px;
  }
  .test-block2 {
    color: green;
    font-weight: 500px;
    font-size: 20px;
  }
}

.test-mouse {
  color: pink;
  font-weight: 700px;
  font-size: 40px;
}

.test-i18n {
  color: purple;
  font-weight: 700px;
  font-size: 40px;
}
</style>
