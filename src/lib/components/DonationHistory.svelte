<script lang="ts">
  import { formatCurrency } from '$lib/utils/currency';
  import { formatDate } from '$lib/utils/date';
  import Table from './Table.svelte';
  import Select from './Select.svelte';
  import Input from './Input.svelte';
  import Badge from './Badge.svelte';

  export let donations: Array&lt;{
    id: string;
    campaignTitle: string;
    amount: number;
    date: Date;
    status: 'completed' | 'pending' | 'failed';
    paymentMethod: string;
  }>;

  let sortField = 'date';
  let sortOrder: 'asc' | 'desc' = 'desc';
  let filterStatus = 'all';
  let searchQuery = '';
  let minAmount = '';
  let maxAmount = '';

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' }
  ];

  const sortOptions = [
    { value: 'date-desc', label: 'Most Recent' },
    { value: 'date-asc', label: 'Oldest First' },
    { value: 'amount-desc', label: 'Highest Amount' },
    { value: 'amount-asc', label: 'Lowest Amount' }
  ];

  $: filteredDonations = donations
    .filter(d => {
      if (filterStatus !== 'all' && d.status !== filterStatus) return false;
      if (searchQuery && !d.campaignTitle.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (minAmount && d.amount < Number(minAmount)) return false;
      if (maxAmount && d.amount > Number(maxAmount)) return false;
      return true;
    })
    .sort((a, b) => {
      const order = sortOrder === 'desc' ? -1 : 1;
      if (sortField === 'date') {
        return order * (new Date(a.date).getTime() - new Date(b.date).getTime());
      }
      if (sortField === 'amount') {
        return order * (a.amount - b.amount);
      }
      return 0;
    });

  function handleSortChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    const [field, order] = value.split('-');
    sortField = field;
    sortOrder = order as 'asc' | 'desc';
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  }
</script>

<div class="space-y-6">
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
      Donation History
    </h2>
    <div class="flex items-center space-x-3">
      <Select
        options={sortOptions}
        value={`${sortField}-${sortOrder}`}
        on:change={handleSortChange}
      />
      <Select
        options={statusOptions}
        bind:value={filterStatus}
      />
    </div>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <Input
      type="text"
      placeholder="Search campaigns..."
      bind:value={searchQuery}
    />
    <Input
      type="number"
      placeholder="Min amount"
      bind:value={minAmount}
    />
    <Input
      type="number"
      placeholder="Max amount"
      bind:value={maxAmount}
    />
  </div>

  {#if filteredDonations.length === 0}
    <div class="text-center py-8 text-gray-600 dark:text-gray-400">
      No donations found matching your filters.
    </div>
  {:else}
    <div class="overflow-x-auto">
      <Table>
        <thead>
          <tr>
            <th>Campaign</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Payment Method</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {#each filteredDonations as donation}
            <tr>
              <td>{donation.campaignTitle}</td>
              <td>{formatCurrency(donation.amount)}</td>
              <td>{formatDate(donation.date)}</td>
              <td class="capitalize">{donation.paymentMethod}</td>
              <td>
                <Badge variant={getStatusColor(donation.status)} class="capitalize">
                  {donation.status}
                </Badge>
              </td>
            </tr>
          {/each}
        </tbody>
      </Table>
    </div>

    <div class="text-sm text-gray-600 dark:text-gray-400">
      Showing {filteredDonations.length} of {donations.length} donations
    </div>
  {/if}
</div> 