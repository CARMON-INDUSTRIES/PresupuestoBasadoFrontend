// Una escritura a la vez; los cambios que llegan durante el envío se guardan después.
export function createSaveQueue(read, write, saved = () => {}) {
  let pending
  let lastSaved
  return {
    markSaved(value) {
      lastSaved = JSON.stringify(value)
    },
    isDirty() {
      return JSON.stringify(read()) !== lastSaved
    },
    flush() {
      if (pending) return pending
      pending = (async () => {
        while (JSON.stringify(read()) !== lastSaved) {
          const snapshot = JSON.stringify(read())
          const result = await write(JSON.parse(snapshot))
          lastSaved = snapshot
          const acknowledged = saved(result, JSON.parse(snapshot))
          if (acknowledged !== undefined) lastSaved = JSON.stringify(acknowledged)
        }
      })().finally(() => {
        pending = null
      })
      return pending
    },
  }
}
