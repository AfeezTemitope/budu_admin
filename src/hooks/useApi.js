import { useState, useEffect, useCallback } from 'react'

export function useApi(fetchFn, deps = [], options = {}) {
  const { immediate = true, initialData = null } = options
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState(null)
  const [offline, setOffline] = useState(false)

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    setOffline(false)
    try {
      const result = await fetchFn(...args)
      setData(result)
      return result
    } catch (err) {
      const msg = err.message || 'Something went wrong'
      if (msg === 'Network Error' || !err.status) {
        setOffline(true)
        setData(initialData)
      } else {
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }, deps)

  useEffect(() => {
    if (immediate) execute()
  }, [execute, immediate])

  return { data, loading, error, offline, execute, setData }
}

export function useMutation(mutationFn) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    try {
      const result = await mutationFn(...args)
      return result
    } catch (err) {
      setError(err.message || 'Something went wrong')
      throw err
    } finally {
      setLoading(false)
    }
  }, [mutationFn])

  return { execute, loading, error }
}
