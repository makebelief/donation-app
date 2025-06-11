<script lang="ts">
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  
  export let data: PageData;
  let project: any = null;
  let amount = '';
  let phoneNumber = '';
  let loading = {
    project: true,
    donation: false
  };
  let error = '';
  let success = '';

  onMount(async () => {
    try {
      const response = await fetch(`/api/projects/${data.id}`);
      if (!response.ok) {
        throw new Error('Project not found');
      }
      project = await response.json();
    } catch (err) {
      error = err.message || 'Failed to load project details';
    } finally {
      loading.project = false;
    }
  });

  function formatAmount(amount: number) {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  }

  const suggestedAmounts = [1000, 2000, 5000, 10000];

  async function handleSubmit() {
    loading.donation = true;
    error = '';
    success = '';

    try {
      // Validate input
      if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        throw new Error('Please enter a valid amount');
      }

      if (!phoneNumber || !/^254[0-9]{9}$/.test(phoneNumber)) {
        throw new Error('Please enter a valid Kenyan phone number (format: 254XXXXXXXXX)');
      }

      // Submit donation
      const response = await fetch('/api/donate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          projectId: data.id,
          amount: Number(amount),
          phoneNumber
        })
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to process donation');
      }

      success = 'Payment request sent! Please check your phone to complete the M-Pesa payment.';
      amount = '';
      phoneNumber = '';
    } catch (err) {
      error = err.message || 'An error occurred while processing your donation';
    } finally {
      loading.donation = false;
    }
  }
</script>

<svelte:head>
  <title>Donate - {project?.title || 'Loading...'}</title>
</svelte:head>

<main class="min-h-screen bg-gradient-to-b from-warmth-100 to-white py-12">
  <div class="container mx-auto px-4 max-w-4xl">
    <a 
      href="/" 
      class="inline-flex items-center text-ochre-600 hover:text-ochre-700 mb-8 group"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
      </svg>
      Back to Projects
    </a>

    {#if loading.project}
      <div class="flex justify-center items-center min-h-[400px]">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-ochre-500 border-t-transparent"></div>
      </div>
    {:else if error && !project}
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p class="text-red-600">{error}</p>
        <a 
          href="/"
          class="mt-4 inline-block px-6 py-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
        >
          Return Home
        </a>
      </div>
    {:else if project}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Project Details -->
        <div class="bg-white rounded-2xl shadow-xl p-8 order-2 lg:order-1">
          <h1 class="text-3xl font-display font-bold text-ochre-900 mb-6">{project.title}</h1>
          
          <div class="mb-8">
            <div class="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress: {Math.round((project.raised_amount / project.target_amount) * 100)}%</span>
              <span>Goal: {formatAmount(project.target_amount)}</span>
            </div>
            <div class="h-2 bg-ochre-100 rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-ochre-500 to-ochre-600 rounded-full transition-all duration-500"
                style="width: {(project.raised_amount / project.target_amount) * 100}%"
              ></div>
            </div>
          </div>

          <p class="text-gray-600 mb-6">{project.description}</p>

          <div class="p-4 bg-warmth-100 rounded-xl">
            <h3 class="font-semibold text-ochre-900 mb-2">About This Project</h3>
            <ul class="space-y-2 text-sm text-gray-600">
              <li class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                100% of donations go directly to the project
              </li>
              <li class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                Secure M-Pesa payment
              </li>
              <li class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                Regular project updates
              </li>
            </ul>
          </div>
        </div>

        <!-- Donation Form -->
        <div class="bg-white rounded-2xl shadow-xl p-8 order-1 lg:order-2">
          <h2 class="text-2xl font-display font-bold text-ochre-900 mb-6">Make Your Donation</h2>
          
          <form on:submit|preventDefault={handleSubmit} class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Select Amount (KES)
              </label>
              <div class="grid grid-cols-2 gap-2 mb-2">
                {#each suggestedAmounts as suggAmount}
                  <button
                    type="button"
                    class="px-4 py-2 border-2 rounded-lg text-center transition-colors
                      {amount === String(suggAmount)
                        ? 'border-ochre-500 bg-ochre-50 text-ochre-700'
                        : 'border-gray-200 hover:border-ochre-200 text-gray-600 hover:bg-warmth-100'}"
                    on:click={() => amount = String(suggAmount)}
                  >
                    {formatAmount(suggAmount)}
                  </button>
                {/each}
              </div>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">KES</span>
                <input
                  type="number"
                  bind:value={amount}
                  placeholder="Enter custom amount"
                  class="w-full pl-16 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-ochre-500 focus:border-ochre-500"
                  min="1"
                />
              </div>
            </div>

            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
                M-Pesa Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                bind:value={phoneNumber}
                placeholder="254XXXXXXXXX"
                class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-ochre-500 focus:border-ochre-500"
                pattern="^254[0-9]{9}$"
                required
              />
              <p class="mt-1 text-sm text-gray-500">Format: 254XXXXXXXXX (Kenyan numbers only)</p>
            </div>

            {#if error}
              <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-red-600">{error}</p>
              </div>
            {/if}

            {#if success}
              <div class="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p class="text-green-600">{success}</p>
              </div>
            {/if}

            <button
              type="submit"
              class="w-full py-3 px-6 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-600 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg"
              disabled={loading.donation}
            >
              {#if loading.donation}
                <span class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              {:else}
                Donate via M-Pesa
              {/if}
            </button>

            <p class="text-center text-sm text-gray-500 mt-4">
              By donating, you agree to our terms of service and privacy policy.
            </p>
          </form>
        </div>
      </div>
    {/if}
  </div>
</main>

<style>
  /* Custom styles are handled by Tailwind CSS */
</style> 