<!-- src/routes/+error.svelte -->
<script lang="ts">
  import { page } from '$app/stores';
</script>

<div class="min-h-[80vh] flex items-center justify-center px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
  <div class="max-w-max mx-auto">
    <main class="sm:flex">
      <p class="text-4xl font-extrabold text-primary-500 sm:text-5xl">{$page.status}</p>
      <div class="sm:ml-6">
        <div class="sm:border-l sm:border-gray-200 sm:pl-6">
          <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            {#if $page.status === 404}
              Page not found
            {:else if $page.status === 500}
              Server error
            {:else}
              An error occurred
            {/if}
          </h1>
          <p class="mt-3 text-base text-gray-500">
            {#if $page.status === 404}
              Sorry, we couldn't find the page you're looking for.
            {:else if $page.status === 500}
              Our servers are experiencing issues. Please try again later.
            {:else}
              {$page.error?.message || 'Something went wrong. Please try again.'}
            {/if}
          </p>
        </div>
        <div class="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
          <a
            href="/"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Go back home
          </a>
          <a
            href="/contact"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Contact support
          </a>
        </div>
      </div>
    </main>
  </div>
</div>

<div class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
  <div class="max-w-7xl mx-auto flex justify-between items-center">
    <p class="text-sm text-gray-500">
      Need immediate assistance? Our support team is here to help.
    </p>
    <div class="flex space-x-4">
      <a
        href="tel:+1234567890"
        class="text-sm text-primary-600 hover:text-primary-500 flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
        </svg>
        Call Support
      </a>
      <a
        href="mailto:support@afridonate.com"
        class="text-sm text-primary-600 hover:text-primary-500 flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
        Email Support
      </a>
    </div>
  </div>
</div> 