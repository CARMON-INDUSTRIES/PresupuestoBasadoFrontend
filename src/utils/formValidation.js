import { nextTick } from 'vue'
export async function enfocarPrimerError(root = document) {
  await nextTick()
  const field = root.querySelector('.q-field--error input, .q-field--error textarea, [aria-invalid="true"]')
  field?.scrollIntoView?.({ block: 'center', behavior: 'auto' })
  field?.focus?.({ preventScroll: true })
}
