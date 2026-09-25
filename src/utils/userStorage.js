function currentUser() {
  const raw = localStorage.getItem('userNameActual') || ''
  try {
    return String(JSON.parse(raw)).toLowerCase()
  } catch {
    return raw.toLowerCase()
  }
}
const legacyOwner = currentUser()
const sessionKeys = new Set(['token', 'userNameActual'])
export function storageForUser(user = currentUser()) {
  const keyFor = (key) => (sessionKeys.has(key) ? key : `pbr:${user}:${key}`)
  return {
    getItem(key) {
      const value = localStorage.getItem(keyFor(key))
      if (value !== null || !user || user !== legacyOwner || sessionKeys.has(key)) return value
      const old = localStorage.getItem(key)
      if (old !== null) {
        localStorage.setItem(keyFor(key), old)
        localStorage.removeItem(key)
      }
      return old
    },
    setItem(key, value) {
      localStorage.setItem(keyFor(key), value)
    },
    removeItem(key) {
      localStorage.removeItem(keyFor(key))
    },
  }
}
export const userStorage = {
  getItem: (key) => storageForUser().getItem(key),
  setItem: (key, value) => storageForUser().setItem(key, value),
  removeItem: (key) => storageForUser().removeItem(key),
}
