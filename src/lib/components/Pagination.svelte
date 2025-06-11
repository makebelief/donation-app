<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let totalItems = 0;
  export let itemsPerPage = 10;
  export let currentPage = 1;

  const dispatch = createEventDispatcher();

  $: totalPages = Math.ceil(totalItems / itemsPerPage);

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      dispatch('change', { page });
    }
  }
</script>

{#if totalPages > 1}
  <nav class="flex items-center justify-between" aria-label="Pagination">
    <div class="flex flex-1 justify-between sm:justify-start gap-2">
      <button
        class="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        class:opacity-50={currentPage === 1}
        disabled={currentPage === 1}
        on:click={() => goToPage(currentPage - 1)}
      >
        Previous
      </button>
      <button
        class="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        class:opacity-50={currentPage === totalPages}
        disabled={currentPage === totalPages}
        on:click={() => goToPage(currentPage + 1)}
      >
        Next
      </button>
    </div>
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-end">
      <p class="text-sm text-gray-700">
        Showing page <span class="font-medium">{currentPage}</span> of
        <span class="font-medium">{totalPages}</span>
      </p>
    </div>
  </nav>
{/if}
 