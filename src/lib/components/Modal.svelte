<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';

  export let open = false;
  export let title = '';
  export let size: 'sm' | 'md' | 'lg' | 'xl' = 'md';

  const dispatch = createEventDispatcher();

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  function close() {
    dispatch('close');
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && open) {
      close();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
  <div
    class="fixed inset-0 z-50 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
    transition:fade={{ duration: 200 }}
  >
    <div class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
        on:click={close}
      />

      <span class="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
        ​
      </span>

      <div
        class="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:align-middle {sizeClasses[size]}"
        transition:fly={{ y: 20, duration: 200 }}
      >
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          {#if title}
            <div class="mb-4">
              <h3 class="text-lg font-medium leading-6 text-gray-900" id="modal-title">
                {title}
              </h3>
            </div>
          {/if}

          <div class="mt-2">
            <slot />
          </div>
        </div>

        <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <slot name="footer">
            <button
              type="button"
              class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              on:click={close}
            >
              Close
            </button>
          </slot>
        </div>
      </div>
    </div>
  </div>
{/if} 