&lt;script lang="ts">
  import { formatCurrency } from '$lib/utils/currency';
  import { formatDate } from '$lib/utils/date';
  import Progress from './Progress.svelte';
  import Stat from './Stat.svelte';

  export let targetAmount: number;
  export let currentAmount: number;
  export let donorCount: number;
  export let endDate: Date;
  export let startDate: Date;
  export let recentDonations: Array&lt;{
    amount: number;
    donor: string;
    date: Date;
  }>;

  $: progress = (currentAmount / targetAmount) * 100;
  $: remainingAmount = targetAmount - currentAmount;
  $: daysLeft = Math.max(0, Math.ceil((new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
  $: averageDonation = donorCount > 0 ? currentAmount / donorCount : 0;
&lt;/script>

&lt;div class="space-y-6">
  &lt;div class="space-y-2">
    &lt;div class="flex items-end justify-between">
      &lt;h3 class="text-lg font-medium text-gray-900 dark:text-white">
        Campaign Progress
      &lt;/h3>
      &lt;span class="text-sm text-gray-600 dark:text-gray-400">
        {daysLeft} days left
      &lt;/span>
    &lt;/div>

    &lt;Progress value={progress} size="lg" />
    
    &lt;div class="flex justify-between text-sm">
      &lt;span class="font-medium text-gray-900 dark:text-white">
        {formatCurrency(currentAmount)}
      &lt;/span>
      &lt;span class="text-gray-600 dark:text-gray-400">
        of {formatCurrency(targetAmount)} goal
      &lt;/span>
    &lt;/div>
  &lt;/div>

  &lt;div class="grid grid-cols-2 gap-4">
    &lt;Stat
      label="Total Donors"
      value={donorCount.toString()}
      helpText="People who donated"
    />
    &lt;Stat
      label="Average Donation"
      value={formatCurrency(averageDonation)}
      helpText="Per person"
    />
    &lt;Stat
      label="Amount Remaining"
      value={formatCurrency(remainingAmount)}
      helpText="To reach goal"
    />
    &lt;Stat
      label="Campaign Duration"
      value={`${Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))} days`}
      helpText={`${formatDate(startDate)} - ${formatDate(endDate)}`}
    />
  &lt;/div>

  {#if recentDonations.length > 0}
    &lt;div class="space-y-3">
      &lt;h4 class="text-sm font-medium text-gray-900 dark:text-white">
        Recent Donations
      &lt;/h4>
      
      &lt;div class="space-y-2">
        {#each recentDonations as donation}
          &lt;div class="flex items-center justify-between text-sm">
            &lt;div class="flex items-center space-x-2">
              &lt;div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                {donation.donor[0].toUpperCase()}
              &lt;/div>
              &lt;span class="font-medium text-gray-900 dark:text-white">
                {donation.donor}
              &lt;/span>
            &lt;/div>
            &lt;div class="text-right">
              &lt;div class="font-medium text-gray-900 dark:text-white">
                {formatCurrency(donation.amount)}
              &lt;/div>
              &lt;div class="text-xs text-gray-600 dark:text-gray-400">
                {formatDate(donation.date)}
              &lt;/div>
            &lt;/div>
          &lt;/div>
        {/each}
      &lt;/div>
    &lt;/div>
  {/if}
&lt;/div> 