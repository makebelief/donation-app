<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let tabs: { id: string; label: string }[] = [];
  export let activeTab: string = '';
  export let variant: 'pills' | 'underline' = 'underline';

  const dispatch = createEventDispatcher();

  function selectTab(tabId: string) {
    if (tabId !== activeTab) {
      dispatch('change', { tabId });
    }
  }

  $: tabClasses = variant === 'pills'
    ? 'rounded-md px-3 py-2 text-sm font-medium'
    : 'border-b-2 px-1 py-4 text-sm font-medium';

  $: activeClasses = variant === 'pills'
    ? 'bg-primary-100 text-primary-700'
    : 'border-primary-500 text-primary-600';

  $: inactiveClasses = variant === 'pills'
    ? 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700';
</script>

<div class="border-b border-gray-200">
  <nav class="-mb-px flex space-x-8" aria-label="Tabs">
    {#each tabs as tab}
      <button
        class={tabClasses}
        class:${activeClasses}={tab.id === activeTab}
        class:${inactiveClasses}={tab.id !== activeTab}
        aria-current={tab.id === activeTab ? 'page' : undefined}
        on:click={() => selectTab(tab.id)}
      >
        {tab.label}
      </button>
    {/each}
  </nav>
</div>

<div class="mt-4">
  <slot />
</div> 