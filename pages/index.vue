<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">{{ $t('dashboard.title') }}</h1>
    
    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card v-for="stat in stats" :key="stat.title">
        <template #title>{{ stat.title }}</template>
        <template #content>
          <div class="text-2xl font-bold">{{ stat.value }}</div>
        </template>
      </Card>
    </div>

    <!-- Recent Analyses -->
    <DataTable :value="analysisStore.recentAnalyses" :paginator="true" :rows="5" class="mb-6"
      :loading="analysisStore.loading">
      <Column field="title" :header="$t('dashboard.productTitle')" sortable></Column>
      <Column field="url" :header="$t('dashboard.productUrl')"></Column>
      <Column field="createdAt" :header="$t('dashboard.analyzedDate')" sortable>
        <template #body="slotProps">
          {{ new Date(slotProps.data.createdAt).toLocaleDateString() }}
        </template>
      </Column>
      <Column :header="$t('dashboard.actions')">
        <template #body="slotProps">
          <Button icon="pi pi-eye" @click="viewAnalysis(slotProps.data.id)" />
        </template>
      </Column>
    </DataTable>

    <!-- Trending Keywords Chart -->
    <Card class="mb-6">
      <template #title>{{ $t('dashboard.trendingKeywords') }}</template>
      <template #content>
        <Chart type="line" :data="chartData" :options="chartOptions" />
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useAnalysisStore } from '~/stores/analysis'

const analysisStore = useAnalysisStore()

useHead({
  title: 'Trendyki - E-commerce Keyword Analytics Dashboard',
  meta: [
    { name: 'description', content: 'Analyze and optimize your e-commerce product listings with powerful keyword insights and competitor analysis.' }
  ]
})

const stats = computed(() => [
  { 
    title: 'Total Analyses', 
    value: analysisStore.recentAnalyses.length.toString() 
  },
  { 
    title: 'Tracked Keywords', 
    value: analysisStore.recentAnalyses.reduce((acc, analysis) => 
      acc + (analysis.keywords?.length || 0), 0).toString() 
  },
  { 
    title: 'Active Reports', 
    value: analysisStore.recentAnalyses.length.toString() 
  }
])

const chartData = computed(() => {
  const keywordData = analysisStore.recentAnalyses
    .flatMap(a => a.keywords || [])
    .reduce((acc, keyword) => {
      const month = new Date(keyword.createdAt).toLocaleString('default', { month: 'long' })
      acc[month] = (acc[month] || 0) + keyword.searchVolume
      return acc
    }, {} as Record<string, number>)

  return {
    labels: Object.keys(keywordData),
    datasets: [{
      label: 'Search Volume',
      data: Object.values(keywordData),
      fill: false,
      borderColor: '#4CAF50'
    }]
  }
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false
})

const viewAnalysis = (id: string) => {
  navigateTo(`/analysis/${id}`)
}

onMounted(() => {
  analysisStore.fetchRecentAnalyses()
})
</script> 