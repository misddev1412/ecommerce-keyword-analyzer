import { defineStore } from 'pinia'

interface Analysis {
  id: string
  title: string
  url: string
  price: number
  category: string
  createdAt: string
  keywords: Array<{
    term: string
    searchVolume: number
    trend: string
  }>
  competitors: Array<{
    title: string
    price: number
    rating: number
  }>
  recommendations: Array<{
    title: string
    description: string
    action?: string
  }>
}

export const useAnalysisStore = defineStore('analysis', {
  state: () => ({
    recentAnalyses: [] as Analysis[],
    currentAnalysis: null as Analysis | null,
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchRecentAnalyses() {
      this.loading = true
      try {
        const response = await $fetch('/api/analysis')
        this.recentAnalyses = response
      } catch (error) {
        this.error = 'Failed to fetch recent analyses'
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    async fetchAnalysis(id: string) {
      this.loading = true
      try {
        const response = await $fetch(`/api/analysis/${id}`)
        this.currentAnalysis = response
      } catch (error) {
        this.error = 'Failed to fetch analysis details'
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    async createAnalysis(data: { url: string; category: string; marketplace: string }) {
      this.loading = true
      try {
        const response = await $fetch('/api/analysis', {
          method: 'POST',
          body: data
        })
        this.recentAnalyses.unshift(response)
        return response
      } catch (error) {
        this.error = 'Failed to create analysis'
        console.error(error)
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) 