// Requires i18n instance
import { i18n } from '@/plugins/i18n'

/**
 * @typedef {Function} TranslateModule
 * 获取指定 i18n 模块内的翻译
 *
 * @example
 * `/locales/modules/home/en.json`
 * {
 *   'proxies': {
 *     'title': 'Proxies',
 *   },
 * }
 *
 * `x.js`
 * useI18n('home', 'proxies').tm('title') => $t('home.proxies.title')
 *
 * @returns {string} 翻译值
 */

/**
 * @typedef {Function} TranslateNamespace
 * 获取指定 i18n 模块中指定命名空间（字段）内的翻译
 *
 * @example
 * `/locales/modules/home/en.json`
 * {
 *   'proxies': {
 *     'title': 'Proxies',
 *   },
 * }
 *
 * `x.js`
 * useI18n('home', 'proxies').tn('title') => $t('home.proxies.title')
 *
 * @param {string} key 翻译键
 * @returns {string} 翻译值
 */

/**
 * @typedef {object} I18nInstance useI18n 实例
 * @property {string} module 模块
 * @property {string} namespace 命名空间
 * @property {TranslateModule} tm 获取指定 i18n 模块内的翻译
 * @property {TranslateNamespace} tn 获取指定 i18n 模块中指定命名空间（字段）内的翻译
 */

/**
 * 使用 i18n
 * @param {string} module 模块
 * @param {string} namespace 命名空间
 * @returns {I18nInstance} useI18n 实例
 */
export default function useI18n(module, namespace) {
  if (!module) {
    throw new Error('useI18n: module is required')
  }

  return {
    module,
    namespace,

    tm(key) {
      return i18n.t(`${module}.${key}`)
    },

    tn(key) {
      return namespace ? i18n.t(`${module}.${namespace}.${key}`) : i18n.t(`${module}.${key}`)
    },
  }
}
