import { defineStore } from 'pinia'

interface Keyword {
  id: string
  term: string
  searchVolume: number
  trend: string
  createdAt: string
}

interface Competitor {
  id: string
  title: string
  url: string
  price: number
  rating: number
  promotions: Record<string, any>
  keywordUsage: Record<string, any>
}

interface Recommendation {
  title: string
  description: string
  action?: string
}

interface Analysis {
  id: string
  title: string
  url: string
  price: number
  category: string
  createdAt: string
  keywords: Keyword[]
  competitors: Competitor[]
  recommendations: Recommendation[]
}

interface AnalysisState {
  recentAnalyses: Analysis[]
  currentAnalysis: Analysis | null
  loading: boolean
  error: string | null
}

export const useAnalysisStore = defineStore('analysis', {
  state: (): AnalysisState => ({
    recentAnalyses: [],
    currentAnalysis: null,
    loading: false,
    error: null
  }),

  actions: {
    async fetchRecentAnalyses() {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<Analysis[]>('/api/analysis')
        this.recentAnalyses = response
      } catch (error) {
        console.error('Failed to fetch analyses:', error)
        this.error = 'Failed to fetch recent analyses. Please try again later.'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchAnalysis(id: string) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<Analysis>(`/api/analysis/${id}`)
        this.currentAnalysis = response
      } catch (error) {
        console.error('Failed to fetch analysis:', error)
        this.error = 'Failed to fetch analysis details. Please try again later.'
        throw error
      } finally {
        this.loading = false
      }
    },

    async createAnalysis(data: { url: string; category: string; marketplace: string }) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<Analysis>('/api/analysis', {
          method: 'POST',
          body: data
        })
        this.recentAnalyses.unshift(response)
        return response
      } catch (error) {
        console.error('Failed to create analysis:', error)
        this.error = 'Failed to create analysis. Please try again later.'
        throw error
      } finally {
        this.loading = false
      }
    },

    clearError() {
      this.error = null
    }
  }
}) 