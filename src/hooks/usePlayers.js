import { useCallback } from 'react'
import { useApi, useMutation } from './useApi'
import { playersService } from '../api'

// Fetch player list with optional filters
export function usePlayers(filters = {}) {
  const fetchPlayers = useCallback(() => playersService.list(filters), [JSON.stringify(filters)])
  return useApi(fetchPlayers, [JSON.stringify(filters)], { initialData: [] })
}

// Fetch single player
export function usePlayer(id) {
  const fetchPlayer = useCallback(() => playersService.get(id), [id])
  return useApi(fetchPlayer, [id])
}

// Create player mutation
export function useCreatePlayer() {
  return useMutation(playersService.create)
}

// Update player mutation
export function useUpdatePlayer() {
  return useMutation((id, data) => playersService.update(id, data))
}

// Delete player mutation
export function useDeletePlayer() {
  return useMutation(playersService.delete)
}

// Upload player photo mutation
export function useUploadPlayerPhoto() {
  return useMutation((id, file) => playersService.uploadPhoto(id, file))
}

// Extract data from uploaded PDF
export function useExtractFromPdf() {
  return useMutation(playersService.extractFromPdf)
}
