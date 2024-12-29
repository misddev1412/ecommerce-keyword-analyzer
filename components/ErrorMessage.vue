<template>
  <div v-if="error" class="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
    <div class="flex">
      <div class="flex-shrink-0">
        <i class="pi pi-exclamation-circle text-red-400" />
      </div>
      <div class="ml-3">
        <p class="text-sm text-red-700">
          {{ error }}
        </p>
      </div>
      <div class="ml-auto pl-3">
        <div class="-mx-1.5 -my-1.5">
          <button
            type="button"
            class="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none"
            @click="onDismiss"
          >
            <span class="sr-only">Dismiss</span>
            <i class="pi pi-times" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  error: string | null
}>()

const emit = defineEmits<{
  (e: 'dismiss'): void
}>()

const onDismiss = () => {
  emit('dismiss')
}
</script> 