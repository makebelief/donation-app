&lt;script lang="ts">
  import { page } from '$app/stores';
  import { auth } from '$lib/stores/auth';

  export let items: { label: string; href: string }[] = [];
  export let userMenuItems: { label: string; href: string }[] = [];

  let isMenuOpen = false;
  let isUserMenuOpen = false;

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  function toggleUserMenu() {
    isUserMenuOpen = !isUserMenuOpen;
  }

  function closeMenus() {
    isMenuOpen = false;
    isUserMenuOpen = false;
  }
&lt;/script>

&lt;nav class="bg-white shadow">
  &lt;div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    &lt;div class="flex h-16 justify-between">
      &lt;div class="flex">
        &lt;div class="flex flex-shrink-0 items-center">
          &lt;a href="/" class="text-xl font-bold text-primary-600">
            &lt;slot name="logo" />
          &lt;/a>
        &lt;/div>
        &lt;div class="hidden sm:ml-6 sm:flex sm:space-x-8">
          {#each items as item}
            &lt;a
              href={item.href}
              class="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium"
              class:border-primary-500={$page.url.pathname === item.href}
              class:text-primary-600={$page.url.pathname === item.href}
              class:border-transparent={$page.url.pathname !== item.href}
              class:text-gray-500={$page.url.pathname !== item.href}
              class:hover:border-gray-300={$page.url.pathname !== item.href}
              class:hover:text-gray-700={$page.url.pathname !== item.href}
            >
              {item.label}
            &lt;/a>
          {/each}
        &lt;/div>
      &lt;/div>
      &lt;div class="hidden sm:ml-6 sm:flex sm:items-center">
        {#if $auth.user}
          &lt;div class="relative ml-3">
            &lt;button
              type="button"
              class="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              on:click={toggleUserMenu}
            >
              &lt;span class="sr-only">Open user menu&lt;/span>
              &lt;img
                class="h-8 w-8 rounded-full"
                src={`https://ui-avatars.com/api/?name=${$auth.user.name || 'User'}&background=random`}
                alt=""
              />
            &lt;/button>
            {#if isUserMenuOpen}
              &lt;div
                class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
              >
                {#each userMenuItems as item}
                  &lt;a
                    href={item.href}
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    on:click={closeMenus}
                  >
                    {item.label}
                  &lt;/a>
                {/each}
              &lt;/div>
            {/if}
          &lt;/div>
        {:else}
          &lt;div class="flex items-center space-x-4">
            &lt;a
              href="/login"
              class="text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              Sign in
            &lt;/a>
            &lt;a
              href="/register"
              class="rounded-md bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              Sign up
            &lt;/a>
          &lt;/div>
        {/if}
      &lt;/div>
      &lt;div class="-mr-2 flex items-center sm:hidden">
        &lt;button
          type="button"
          class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
          on:click={toggleMenu}
        >
          &lt;span class="sr-only">Open main menu&lt;/span>
          {#if isMenuOpen}
            &lt;svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              &lt;path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            &lt;/svg>
          {:else}
            &lt;svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              &lt;path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            &lt;/svg>
          {/if}
        &lt;/button>
      &lt;/div>
    &lt;/div>
  &lt;/div>

  {#if isMenuOpen}
    &lt;div class="sm:hidden">
      &lt;div class="space-y-1 pb-3 pt-2">
        {#each items as item}
          &lt;a
            href={item.href}
            class="block border-l-4 py-2 pl-3 pr-4 text-base font-medium"
            class:border-primary-500={$page.url.pathname === item.href}
            class:text-primary-600={$page.url.pathname === item.href}
            class:border-transparent={$page.url.pathname !== item.href}
            class:text-gray-500={$page.url.pathname !== item.href}
            class:hover:border-gray-300={$page.url.pathname !== item.href}
            class:hover:text-gray-700={$page.url.pathname !== item.href}
            on:click={closeMenus}
          >
            {item.label}
          &lt;/a>
        {/each}
      &lt;/div>
      {#if $auth.user}
        &lt;div class="border-t border-gray-200 pb-3 pt-4">
          &lt;div class="flex items-center px-4">
            &lt;div class="flex-shrink-0">
              &lt;img
                class="h-10 w-10 rounded-full"
                src={`https://ui-avatars.com/api/?name=${$auth.user.name || 'User'}&background=random`}
                alt=""
              />
            &lt;/div>
            &lt;div class="ml-3">
              &lt;div class="text-base font-medium text-gray-800">{$auth.user.name || 'User'}&lt;/div>
              &lt;div class="text-sm font-medium text-gray-500">{$auth.user.email}&lt;/div>
            &lt;/div>
          &lt;/div>
          &lt;div class="mt-3 space-y-1">
            {#each userMenuItems as item}
              &lt;a
                href={item.href}
                class="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                on:click={closeMenus}
              >
                {item.label}
              &lt;/a>
            {/each}
          &lt;/div>
        &lt;/div>
      {:else}
        &lt;div class="border-t border-gray-200 pb-3 pt-4">
          &lt;div class="space-y-1">
            &lt;a
              href="/login"
              class="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              on:click={closeMenus}
            >
              Sign in
            &lt;/a>
            &lt;a
              href="/register"
              class="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              on:click={closeMenus}
            >
              Sign up
            &lt;/a>
          &lt;/div>
        &lt;/div>
      {/if}
    &lt;/div>
  {/if}
&lt;/nav> 