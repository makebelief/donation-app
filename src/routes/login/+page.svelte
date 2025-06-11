<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import type { PageData } from './$types';

  export let data: PageData;
  let loading = false;
  let error: string | null = data.error;

  $: redirectTo = data.redirect || '/admin';
</script>

<svelte:head>
  <title>Admin Login | Donation Platform</title>
</svelte:head>

<div class="min-h-screen relative">
  <!-- Background with overlay -->
  <div class="fixed inset-0 z-0">
    <div class="absolute inset-0 bg-gradient-to-br from-blue-900 to-gray-900 opacity-90"></div>
    <div class="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>
  </div>

  <!-- Content -->
  <div class="relative z-10 flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Admin Login</h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">Sign in to access the admin dashboard</p>
        </div>

        {#if error}
          <div class="mb-6 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg p-4 text-sm">
            {error}
          </div>
        {/if}

        <form
          method="POST"
          use:enhance={() => {
            loading = true;
            error = null;
            
            return async ({ result }) => {
              loading = false;
              
              if (result.type === 'success') {
                goto(redirectTo);
              } else if (result.type === 'error') {
                error = result.error?.message || 'An error occurred';
              }
            };
          }}
          class="space-y-6"
        >
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              class="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="admin@example.com"
              disabled={loading}
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              class="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
            disabled={loading}
          >
            {#if loading}
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            {:else}
              Sign in
            {/if}
          </button>
        </form>
      </div>
    </div>
  </div>
</div>

<style>
  /* Add a subtle animation for the form */
  form {
    animation: fadeIn 0.5s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style> 