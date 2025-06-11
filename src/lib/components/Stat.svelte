&lt;script lang="ts">
  export let label = '';
  export let value = '';
  export let description = '';
  export let icon: string | undefined = undefined;
  export let trend: 'up' | 'down' | undefined = undefined;
  export let trendValue = '';

  $: trendClasses = trend === 'up'
    ? 'text-green-600 bg-green-100'
    : 'text-red-600 bg-red-100';
&lt;/script>

&lt;div class="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
  &lt;dt>
    {#if icon}
      &lt;div class="absolute rounded-md bg-primary-500 p-3">
        {@html icon}
      &lt;/div>
    {/if}
    &lt;p class={icon ? "ml-16 truncate text-sm font-medium text-gray-500" : "truncate text-sm font-medium text-gray-500"}>
      {label}
    &lt;/p>
  &lt;/dt>
  &lt;dd class={icon ? "ml-16 flex items-baseline" : "flex items-baseline"}>
    &lt;p class="text-2xl font-semibold text-gray-900">
      {value}
    &lt;/p>
    {#if trend}
      &lt;p class="ml-2 flex items-baseline text-sm font-semibold">
        &lt;span class={trendClasses + " inline-flex items-baseline rounded-full px-2.5 py-0.5"}>
          {#if trend === 'up'}
            &lt;svg class="-ml-1 mr-0.5 h-4 w-4 flex-shrink-0 self-center" fill="currentColor" viewBox="0 0 20 20">
              &lt;path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            &lt;/svg>
          {:else}
            &lt;svg class="-ml-1 mr-0.5 h-4 w-4 flex-shrink-0 self-center" fill="currentColor" viewBox="0 0 20 20">
              &lt;path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            &lt;/svg>
          {/if}
          {trendValue}
        &lt;/span>
      &lt;/p>
    {/if}
    {#if description}
      &lt;div class="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
        &lt;div class="text-sm">
          &lt;p class="text-gray-500">{description}&lt;/p>
        &lt;/div>
      &lt;/div>
    {/if}
  &lt;/dd>
&lt;/div> 