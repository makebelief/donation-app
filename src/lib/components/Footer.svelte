&lt;script lang="ts">
  import { APP_NAME } from '$lib/constants/config';

  export let navigation: { label: string; href: string }[] = [];
  export let social: { label: string; href: string; icon: string }[] = [];
&lt;/script>

&lt;footer class="bg-white">
  &lt;div class="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
    &lt;nav class="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
      {#each navigation as item}
        &lt;div class="pb-6">
          &lt;a href={item.href} class="text-sm leading-6 text-gray-600 hover:text-gray-900">
            {item.label}
          &lt;/a>
        &lt;/div>
      {/each}
    &lt;/nav>

    {#if social.length > 0}
      &lt;div class="mt-10 flex justify-center space-x-10">
        {#each social as item}
          &lt;a href={item.href} class="text-gray-400 hover:text-gray-500">
            &lt;span class="sr-only">{item.label}&lt;/span>
            {@html item.icon}
          &lt;/a>
        {/each}
      &lt;/div>
    {/if}

    &lt;p class="mt-10 text-center text-xs leading-5 text-gray-500">
      &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
    &lt;/p>
  &lt;/div>
&lt;/footer> 