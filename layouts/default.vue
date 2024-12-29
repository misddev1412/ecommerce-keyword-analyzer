<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <!-- Logo -->
            <div class="flex-shrink-0 flex items-center">
              <NuxtLink to="/" class="text-xl font-bold text-blue-600">
                Trendyki
              </NuxtLink>
            </div>
            <!-- Navigation Links -->
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NuxtLink
                v-for="item in navigationItems"
                :key="item.path"
                :to="item.path"
                class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
              >
                {{ $t(item.label) }}
              </NuxtLink>
            </div>
          </div>
          <!-- Language Switcher -->
          <div class="flex items-center">
            <Button
              @click="switchLocale"
              :label="$i18n.locale === 'en' ? 'VI' : 'EN'"
              class="p-button-text"
            />
          </div>
        </div>
      </div>
    </nav>

    <!-- Page Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <slot />
    </main>

    <!-- Toast -->
    <Toast position="bottom-right" />
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n()

const navigationItems = [
  { path: '/dashboard', label: 'dashboard' },
  { path: '/keywords', label: 'keywords' },
  { path: '/trends', label: 'trends' },
]

const switchLocale = () => {
  locale.value = locale.value === 'en' ? 'vi' : 'en'
}
</script> 