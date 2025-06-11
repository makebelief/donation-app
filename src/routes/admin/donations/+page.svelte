<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  let donations = [];
  let loading = true;
  let error = null;
  let selectedDonation = null;
  let showDetails = false;

  // Filters
  let filters = {
    status: 'all',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: ''
  };

  onMount(async () => {
    await loadDonations();
  });

  async function loadDonations() {
    try {
      const queryParams = new URLSearchParams();
      if (filters.status !== 'all') queryParams.append('status', filters.status);
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
      if (filters.minAmount) queryParams.append('minAmount', filters.minAmount);
      if (filters.maxAmount) queryParams.append('maxAmount', filters.maxAmount);

      const response = await fetch(`/api/admin/donations?${queryParams}`);
      if (!response.ok) throw new Error('Failed to load donations');
      donations = await response.json();
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  async function updateDonationStatus(id: string, status: string) {
    try {
      const response = await fetch(`/api/admin/donations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (!response.ok) throw new Error('Failed to update donation status');
      await loadDonations();
    } catch (err) {
      error = err.message;
    }
  }

  function viewDonationDetails(donation) {
    selectedDonation = donation;
    showDetails = true;
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function formatAmount(amount: number) {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  }

  async function handleFiltersSubmit() {
    loading = true;
    await loadDonations();
  }

  function resetFilters() {
    filters = {
      status: 'all',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: ''
    };
    handleFiltersSubmit();
  }
</script>

<div class="space-y-6">
  <div class="flex justify-between items-center">
    <h1 class="text-2xl font-semibold text-gray-900">Donations</h1>
    <div class="flex space-x-3">
      <button
        class="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
        on:click={resetFilters}
      >
        Reset Filters
      </button>
    </div>
  </div>

  {#if error}
    <div class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
      {error}
    </div>
  {/if}

  <!-- Filters -->
  <div class="bg-white shadow rounded-lg p-6">
    <h2 class="text-lg font-medium text-gray-900 mb-4">Filters</h2>
    <form on:submit|preventDefault={handleFiltersSubmit} class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
        <select
          id="status"
          bind:value={filters.status}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="all">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>

      <div>
        <label for="startDate" class="block text-sm font-medium text-gray-700">Start Date</label>
        <input
          type="date"
          id="startDate"
          bind:value={filters.startDate}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      <div>
        <label for="endDate" class="block text-sm font-medium text-gray-700">End Date</label>
        <input
          type="date"
          id="endDate"
          bind:value={filters.endDate}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      <div>
        <label for="minAmount" class="block text-sm font-medium text-gray-700">Min Amount</label>
        <input
          type="number"
          id="minAmount"
          bind:value={filters.minAmount}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          min="0"
        />
      </div>

      <div>
        <label for="maxAmount" class="block text-sm font-medium text-gray-700">Max Amount</label>
        <input
          type="number"
          id="maxAmount"
          bind:value={filters.maxAmount}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          min="0"
        />
      </div>

      <div class="flex items-end">
        <button
          type="submit"
          class="w-full px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
        >
          Apply Filters
        </button>
      </div>
    </form>
  </div>

  {#if loading}
    <div class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
    </div>
  {:else}
    <div class="bg-white shadow overflow-hidden rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each donations as donation}
            <tr>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{donation.donor_name || 'Anonymous'}</div>
                <div class="text-sm text-gray-500">{donation.donor_email || 'N/A'}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{donation.project_title}</div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                {formatAmount(donation.amount)}
              </td>
              <td class="px-6 py-4">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  {donation.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                   donation.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                   'bg-red-100 text-red-800'}">
                  {donation.status}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {formatDate(donation.created_at)}
              </td>
              <td class="px-6 py-4 text-sm font-medium space-x-3">
                <button
                  class="text-primary-600 hover:text-primary-900"
                  on:click={() => viewDonationDetails(donation)}
                >
                  View Details
                </button>
                {#if donation.status === 'PENDING'}
                  <button
                    class="text-green-600 hover:text-green-900"
                    on:click={() => updateDonationStatus(donation.id, 'COMPLETED')}
                  >
                    Mark Complete
                  </button>
                {/if}
              </td>
            </tr>
          {:else}
            <tr>
              <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                No donations found
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

{#if showDetails && selectedDonation}
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50" transition:fade>
    <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
      <div class="flex justify-between items-start mb-4">
        <h2 class="text-xl font-semibold text-gray-900">Donation Details</h2>
        <button
          class="text-gray-400 hover:text-gray-500"
          on:click={() => showDetails = false}
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <div class="text-sm font-medium text-gray-500">Donor Name</div>
            <div class="mt-1 text-sm text-gray-900">{selectedDonation.donor_name || 'Anonymous'}</div>
          </div>
          <div>
            <div class="text-sm font-medium text-gray-500">Donor Email</div>
            <div class="mt-1 text-sm text-gray-900">{selectedDonation.donor_email || 'N/A'}</div>
          </div>
          <div>
            <div class="text-sm font-medium text-gray-500">Amount</div>
            <div class="mt-1 text-sm text-gray-900">{formatAmount(selectedDonation.amount)}</div>
          </div>
          <div>
            <div class="text-sm font-medium text-gray-500">Status</div>
            <div class="mt-1">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                {selectedDonation.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                 selectedDonation.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                 'bg-red-100 text-red-800'}">
                {selectedDonation.status}
              </span>
            </div>
          </div>
          <div>
            <div class="text-sm font-medium text-gray-500">Date</div>
            <div class="mt-1 text-sm text-gray-900">{formatDate(selectedDonation.created_at)}</div>
          </div>
          <div>
            <div class="text-sm font-medium text-gray-500">Payment Method</div>
            <div class="mt-1 text-sm text-gray-900">{selectedDonation.payment_method || 'N/A'}</div>
          </div>
        </div>

        <div>
          <div class="text-sm font-medium text-gray-500">Project</div>
          <div class="mt-1 text-sm text-gray-900">{selectedDonation.project_title}</div>
        </div>

        {#if selectedDonation.message}
          <div>
            <div class="text-sm font-medium text-gray-500">Message</div>
            <div class="mt-1 text-sm text-gray-900">{selectedDonation.message}</div>
          </div>
        {/if}

        {#if selectedDonation.transaction_id}
          <div>
            <div class="text-sm font-medium text-gray-500">Transaction ID</div>
            <div class="mt-1 text-sm text-gray-900">{selectedDonation.transaction_id}</div>
          </div>
        {/if}
      </div>

      <div class="mt-6 flex justify-end space-x-3">
        {#if selectedDonation.status === 'PENDING'}
          <button
            class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            on:click={() => {
              updateDonationStatus(selectedDonation.id, 'COMPLETED');
              showDetails = false;
            }}
          >
            Mark as Complete
          </button>
        {/if}
        <button
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          on:click={() => showDetails = false}
        >
          Close
        </button>
      </div>
    </div>
  </div>
{/if} 