// Only for Vue@^2.7.0, because of `vue-i18n` provide the useI18n function alternative for Vue 3

import { getCurrentInstance } from 'vue'

export function useI18n(module, namespace) {
  const vm = getCurrentInstance()
  const i18n = vm?.appContext.config.globalProperties.$i18n || { t: key => key }
  const t = i18n.t
  const tm = (key) => {
    return t(`${module}.${key}`)
  }
  const tn = (key) => {
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
