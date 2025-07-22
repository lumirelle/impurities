// Requires vue@'^2.7.0 || >=3.0.0'

import { computed, getCurrentInstance, inject, ref, unref } from 'vue'

export const defaultNamespace = 'cus'

const statePrefix = 'is-'

/**
 * Generate a bem class name by namespace, block, block suffix, element and modifier
 *
 * @private
 * @param namespace - The namespace to use
 * @param block - The block to use
 * @param blockSuffix - The block suffix to use
 * @param element - The element to use
 * @param modifier - The modifier to use
 * @returns The bem class
 */
function _bem(namespace, block, blockSuffix, element, modifier) {
  let cls = `${namespace}-${block}`
  if (blockSuffix) {
    cls += `-${blockSuffix}`
  }
  if (element) {
    cls += `__${element}`
  }
  if (modifier) {
    cls += `--${modifier}`
  }
  return cls
}

export const namespaceContextKey = Symbol('namespaceContextKey')

export function useGetDerivedNamespace(namespaceOverrides) {
  const derivedNamespace
    = namespaceOverrides
      || (getCurrentInstance()
        ? inject(namespaceContextKey, ref(defaultNamespace))
        : ref(defaultNamespace))
  const namespace = computed(() => {
    return unref(derivedNamespace) || defaultNamespace
  })
  return namespace
}

export function useNamespace(block, namespaceOverrides) {
  const namespace = useGetDerivedNamespace(namespaceOverrides)
  const b = (blockSuffix = '') =>
    _bem(namespace.value, block, blockSuffix, '', '')
  const e = element =>
    element ? _bem(namespace.value, block, '', element, '') : ''
  const m = modifier =>
    modifier ? _bem(namespace.value, block, '', '', modifier) : ''
  const be = (blockSuffix, element) =>
    blockSuffix && element
      ? _bem(namespace.value, block, blockSuffix, element, '')
      : ''
  const em = (element, modifier) =>
    element && modifier
      ? _bem(namespace.value, block, '', element, modifier)
      : ''
  const bm = (blockSuffix, modifier) =>
    blockSuffix && modifier
      ? _bem(namespace.value, block, blockSuffix, '', modifier)
      : ''
  const bem = (blockSuffix, element, modifier) =>
    blockSuffix && element && modifier
      ? _bem(namespace.value, block, blockSuffix, element, modifier)
      : ''
  const is = (name, ...args) => {
    const state = args.length >= 1 ? args[0] : true
    return name && state ? `${statePrefix}${name}` : ''
  }

  // for css var
  // --cus-xxx: value;
  const cssVar = (object) => {
    const styles = {}
    for (const key in object) {
      if (object[key]) {
        styles[`--${namespace.value}-${key}`] = object[key]
      }
    }
    return styles
  }
  // with block
  const cssVarBlock = (object) => {
    const styles = {}
    for (const key in object) {
      if (object[key]) {
        styles[`--${namespace.value}-${block}-${key}`] = object[key]
      }
    }
    return styles
  }

  const cssVarName = name => `--${namespace.value}-${name}`
  const cssVarBlockName = name =>
    `--${namespace.value}-${block}-${name}`

  return {
    namespace,
    b,
    e,
    m,
    be,
    em,
    bm,
    bem,
    is,
    cssVar,
    cssVarName,
    cssVarBlock,
    cssVarBlockName,
  }
}
