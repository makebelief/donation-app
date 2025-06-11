&lt;script lang="ts">
  import { toast } from '$lib/stores/toast';
  import { fade, fly } from 'svelte/transition';

  const ICONS = {
    success: `&lt;svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
      &lt;path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
    &lt;/svg>`,
    error: `&lt;svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
      &lt;path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
    &lt;/svg>`,
    warning: `&lt;svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
      &lt;path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
    &lt;/svg>`,
    info: `&lt;svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
      &lt;path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
    &lt;/svg>`
  };
&lt;/script>

&lt;div
  class="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
  style="z-index: 9999;"
>
  &lt;div class="flex w-full flex-col items-center space-y-4 sm:items-end">
    {#each $toast as notification (notification.id)}
      &lt;div
        class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5"
        transition:fade={{ duration: 150 }}
        out:fly={{ duration: 150, x: 400 }}
      >
        &lt;div class="p-4">
          &lt;div class="flex items-start">
            &lt;div class="flex-shrink-0">
              {@html ICONS[notification.type]}
            &lt;/div>
            &lt;div class="ml-3 w-0 flex-1 pt-0.5">
              &lt;p class="text-sm font-medium text-gray-900">
                {notification.message}
              &lt;/p>
            &lt;/div>
            &lt;div class="ml-4 flex flex-shrink-0">
              &lt;button
                type="button"
                class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                on:click={() => toast.remove(notification.id)}
              >
                &lt;span class="sr-only">Close&lt;/span>
                &lt;svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  &lt;path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                &lt;/svg>
              &lt;/button>
            &lt;/div>
          &lt;/div>
        &lt;/div>
      &lt;/div>
    {/each}
  &lt;/div>
&lt;/div> 