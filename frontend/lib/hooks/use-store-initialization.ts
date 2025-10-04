import { useEffect } from "react"
import { useAppStore } from "../store"

/**
 * Hook to initialize store data on app startup
 */
export function useStoreInitialization() {
  const initializeData = useAppStore((state) => state.initializeData)

  useEffect(() => {
    initializeData()
  }, [initializeData])
}
