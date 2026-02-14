import { useCallback } from 'react'
import { useApi } from './useApi'
import { dashboardService } from '../api'

export function useDashboardStats() {
  const fetch = useCallback(() => dashboardService.getStats(), [])
  return useApi(fetch, [], { initialData: null })
}

export function useRecentPlayers() {
  const fetch = useCallback(() => dashboardService.getRecentPlayers(), [])
  return useApi(fetch, [], { initialData: [] })
}

export function usePositionBreakdown() {
  const fetch = useCallback(() => dashboardService.getPositionBreakdown(), [])
  return useApi(fetch, [], { initialData: [] })
}
