export function tryCatch<T>(fn: () => T): [T, null] | [null, unknown] {
  try {
    return [fn(), null];
  } catch (err) {
    return [null, err];
  }
}
