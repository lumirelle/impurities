// Only for Vue@^2.7.0, because of `vue-i18n` provide the useI18n function alternative for Vue 3

import { getCurrentInstance } from 'vue'

export function useI18n(module: string, namespace: string) {
  const vm = getCurrentInstance()
  const i18n: { t: (key: string) => string } = vm?.appContext.config.globalProperties.$i18n || { t: (key: string) => key }
  const t = i18n.t
  const tm = (key: string) => {
    return t(`${module}.${key}`)
  }
  const tn = (key: string) => {
    return namespace ? t(`${module}.${namespace}.${key}`) : t(`${module}.${key}`)
  }

  return {
    module,
    namespace,
    t,
    tm,
    tn,
  }
}

export type UseI18nReturn = ReturnType<typeof useI18n>
