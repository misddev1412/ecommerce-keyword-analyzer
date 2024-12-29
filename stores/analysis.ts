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

interface AnalysisStatus {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  error?: string
  timing: {
    created: string
    started?: string
    completed?: string
  }
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
  analysisStatus: Record<string, AnalysisStatus>
  loading: boolean
  error: string | null
  pollingIntervals: Record<string, number>
}

export const useAnalysisStore = defineStore('analysis', {
  state: (): AnalysisState => ({
    recentAnalyses: [],
    currentAnalysis: null,
    analysisStatus: {},
    loading: false,
    error: null,
    pollingIntervals: {}
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
        const response = await $fetch<{ id: string; status: string }>('/api/analysis', {
          method: 'POST',
          body: data
        })
        
        // Start polling for status
        this.startPolling(response.id)
        
        return response
      } catch (error) {
        console.error('Failed to create analysis:', error)
        this.error = 'Failed to create analysis. Please try again later.'
        throw error
      } finally {
        this.loading = false
      }
    },

    async checkAnalysisStatus(id: string) {
      try {
        const status = await $fetch<AnalysisStatus>(`/api/analysis/status/${id}`)
        this.analysisStatus[id] = status

        // If analysis is complete or failed, stop polling
        if (status.status === 'completed' || status.status === 'failed') {
          this.stopPolling(id)
          
          // If completed, fetch full analysis
          if (status.status === 'completed') {
            await this.fetchAnalysis(id)
          }
        }

        return status
      } catch (error) {
        console.error('Failed to check analysis status:', error)
        this.stopPolling(id)
        throw error
      }
    },

    startPolling(id: string) {
      // Stop any existing polling for this ID
      this.stopPolling(id)

      // Start new polling interval
      this.pollingIntervals[id] = window.setInterval(() => {
        this.checkAnalysisStatus(id)
      }, 2000) // Poll every 2 seconds
    },

    stopPolling(id: string) {
      if (this.pollingIntervals[id]) {
        clearInterval(this.pollingIntervals[id])
        delete this.pollingIntervals[id]
      }
    },

    clearError() {
      this.error = null
    },

    // Clean up on component unmount
    cleanup() {
      Object.keys(this.pollingIntervals).forEach(id => {
        this.stopPolling(id)
      })
    }
  }
}) 