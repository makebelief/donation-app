&lt;script lang="ts">
  export let items: { label: string; href?: string }[] = [];
  export let separator = '/';
&lt;/script>

&lt;nav class="flex" aria-label="Breadcrumb">
  &lt;ol role="list" class="flex items-center space-x-4">
    {#each items as item, i}
      &lt;li>
        &lt;div class="flex items-center">
          {#if i > 0}
            &lt;svg
              class="h-5 w-5 flex-shrink-0 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              &lt;path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
            &lt;/svg>
          {/if}
          &lt;div class={i > 0 ? 'ml-4' : ''}>
            {#if item.href && i !== items.length - 1}
              &lt;a
                href={item.href}
                class="text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                {item.label}
              &lt;/a>
            {:else}
              &lt;span class="text-sm font-medium text-gray-900">
                {item.label}
              &lt;/span>
            {/if}
          &lt;/div>
        &lt;/div>
      &lt;/li>
    {/each}
  &lt;/ol>
&lt;/nav> 