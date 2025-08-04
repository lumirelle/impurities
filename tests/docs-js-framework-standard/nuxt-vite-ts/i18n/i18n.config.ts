export default defineI18nConfig(() => {
  return {
    fallbackLocale: 'en',
    messages: {
      'en': {
        hello: 'Hello',
      },
      'zh-CN': {
        hello: '你好',
      },
    },
  }
})
