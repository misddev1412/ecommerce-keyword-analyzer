<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">{{ $t('analysis.details') }}</h1>
      <div class="flex gap-2">
        <Button icon="pi pi-download" @click="downloadReport" :label="$t('analysis.download')" />
        <Button icon="pi pi-share-alt" @click="shareAnalysis" :label="$t('analysis.share')" />
      </div>
    </div>

    <div v-if="analysisStore.loading" class="flex justify-center items-center h-64">
      <ProgressSpinner />
    </div>

    <template v-else-if="analysisStore.currentAnalysis">
      <!-- Status Banner -->
      <div v-if="analysisStore.currentAnalysis.status !== 'completed'" 
           class="mb-6 p-4 rounded-lg"
           :class="{
             'bg-yellow-50 border border-yellow-200': analysisStore.currentAnalysis.status === 'pending',
             'bg-blue-50 border border-blue-200': analysisStore.currentAnalysis.status === 'processing',
             'bg-red-50 border border-red-200': analysisStore.currentAnalysis.status === 'failed'
           }">
        <div class="flex items-center">
          <i class="pi mr-2"
             :class="{
               'pi-clock text-yellow-500': analysisStore.currentAnalysis.status === 'pending',
               'pi-spinner animate-spin text-blue-500': analysisStore.currentAnalysis.status === 'processing',
               'pi-exclamation-circle text-red-500': analysisStore.currentAnalysis.status === 'failed'
             }" />
          <div>
            <h3 class="font-semibold mb-1">
              {{ {
                'pending': $t('analysis.statusPending'),
                'processing': $t('analysis.statusProcessing'),
                'failed': $t('analysis.statusFailed')
              }[analysisStore.currentAnalysis.status] }}
            </h3>
            <p class="text-sm text-gray-600">
              {{ {
                'pending': $t('analysis.pendingMessage'),
                'processing': $t('analysis.processingMessage'),
                'failed': analysisStore.currentAnalysis.error || $t('analysis.failedMessage')
              }[analysisStore.currentAnalysis.status] }}
            </p>
          </div>
        </div>
      </div>

      <!-- Product Overview -->
      <Card class="mb-6">
        <template #title>{{ analysisStore.currentAnalysis.title || $t('analysis.analyzing') }}</template>
        <template #subtitle>
          <a :href="analysisStore.currentAnalysis.url" target="_blank" class="text-blue-500 hover:underline">
            {{ analysisStore.currentAnalysis.url }}
          </a>
        </template>
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 class="font-semibold mb-2">{{ $t('analysis.price') }}</h3>
              <p>{{ analysisStore.currentAnalysis.price ? `$${analysisStore.currentAnalysis.price}` : '...' }}</p>
            </div>
            <div>
              <h3 class="font-semibold mb-2">{{ $t('analysis.category') }}</h3>
              <p>{{ analysisStore.currentAnalysis.category || '...' }}</p>
            </div>
            <div>
              <h3 class="font-semibold mb-2">{{ $t('analysis.analyzedDate') }}</h3>
              <p>{{ formatDate(analysisStore.currentAnalysis.createdAt) }}</p>
            </div>
          </div>
        </template>
      </Card>

      <!-- Only show analysis results when completed -->
      <template v-if="analysisStore.currentAnalysis.status === 'completed' && analysisStore.currentAnalysis.keywords?.length">
        <!-- Keyword Performance -->
        <Card class="mb-6">
          <template #title>{{ $t('analysis.keywordPerformance') }}</template>
          <template #content>
            <Chart type="bar" :data="keywordChartData" :options="chartOptions" class="h-[300px]" />
          </template>
        </Card>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Top Keywords -->
          <Card>
            <template #title>{{ $t('analysis.topKeywords') }}</template>
            <template #content>
              <DataTable :value="analysisStore.currentAnalysis.keywords" :paginator="true" :rows="5">
                <Column field="term" :header="$t('analysis.keyword')" sortable></Column>
                <Column field="searchVolume" :header="$t('analysis.volume')" sortable></Column>
                <Column field="trend" :header="$t('analysis.trend')">
                  <template #body="slotProps">
                    <i :class="getTrendIcon(slotProps.data.trend)" />
                    {{ slotProps.data.trend }}
                  </template>
                </Column>
              </DataTable>
            </template>
          </Card>

          <!-- Competitor Analysis -->
          <Card v-if="analysisStore.currentAnalysis.competitors?.length">
            <template #title>{{ $t('analysis.competitorInsights') }}</template>
            <template #content>
              <DataTable :value="analysisStore.currentAnalysis.competitors" :paginator="true" :rows="5">
                <Column field="title" :header="$t('analysis.competitor')" sortable></Column>
                <Column field="price" :header="$t('analysis.price')" sortable>
                  <template #body="slotProps">
                    ${{ slotProps.data.price }}
                  </template>
                </Column>
                <Column field="rating" :header="$t('analysis.rating')" sortable>
                  <template #body="slotProps">
                    <Rating :modelValue="slotProps.data.rating" readonly :cancel="false" />
                  </template>
                </Column>
              </DataTable>
            </template>
          </Card>
        </div>

        <!-- Recommendations -->
        <Card v-if="analysisStore.currentAnalysis.recommendations?.length" class="mt-6">
          <template #title>{{ $t('analysis.actionableInsights') }}</template>
          <template #content>
            <Timeline :value="analysisStore.currentAnalysis.recommendations">
              <template #content="slotProps">
                <div class="flex flex-col">
                  <span class="font-bold mb-1">{{ slotProps.item.title }}</span>
                  <p class="text-gray-600">{{ slotProps.item.description }}</p>
                  <div v-if="slotProps.item.action" class="mt-2">
                    <Button :label="slotProps.item.action" size="small" />
                  </div>
                </div>
              </template>
            </Timeline>
          </template>
        </Card>
      </template>

      <!-- Loading state for analysis sections -->
      <template v-else-if="analysisStore.currentAnalysis.status === 'completed'">
        <div class="text-center py-8">
          <i class="pi pi-clock text-blue-500 text-4xl mb-4"></i>
          <p class="text-lg text-gray-600">{{ $t('analysis.waitingForKeywords') }}</p>
        </div>
      </template>
    </template>

    <div v-else-if="analysisStore.error" class="text-center py-8">
      <i class="pi pi-exclamation-circle text-red-500 text-4xl mb-4"></i>
      <p class="text-lg text-gray-600">{{ analysisStore.error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAnalysisStore } from '~/stores/analysis'

const route = useRoute()
const analysisStore = useAnalysisStore()

useHead({
  title: 'Analysis Details - Trendyki',
  meta: [
    { name: 'description', content: 'Detailed analysis of your product with keyword insights and competitor data.' }
  ]
})

const keywordChartData = computed(() => ({
  labels: analysisStore.currentAnalysis?.keywords?.map(k => k.term) || [],
  datasets: [{
    label: 'Search Volume',
    data: analysisStore.currentAnalysis?.keywords?.map(k => k.searchVolume) || [],
    backgroundColor: '#4CAF50'
  }]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const getTrendIcon = (trend: string) => {
  return {
    'up': 'pi pi-arrow-up text-green-500',
    'down': 'pi pi-arrow-down text-red-500',
    'stable': 'pi pi-minus text-gray-500'
  }[trend] || 'pi pi-minus text-gray-500'
}

const downloadReport = () => {
  // Implement report download logic
  console.log('Downloading report...')
}

const shareAnalysis = () => {
  // Implement sharing logic
  console.log('Sharing analysis...')
}

onMounted(() => {
  analysisStore.fetchAnalysis(route.params.id as string)
})
</script> 