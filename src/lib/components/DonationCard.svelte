<script lang="ts">
  import { formatCurrency } from '$lib/utils/currency';
  import { formatDate } from '$lib/utils/date';
  import Card from './Card.svelte';
  import Progress from './Progress.svelte';
  import Button from './Button.svelte';
  import Badge from './Badge.svelte';

  export let title: string;
  export let description: string;
  export let imageUrl: string;
  export let targetAmount: number;
  export let currentAmount: number;
  export let endDate: Date;
  export let category: string;
  export let donorCount: number;

  $: progress = (currentAmount / targetAmount) * 100;
  $: isExpired = new Date() > new Date(endDate);
  $: remainingAmount = targetAmount - currentAmount;
</script>

<Card class="overflow-hidden">
  <div class="relative">
    <img
      src={imageUrl}
      alt={title}
      class="w-full h-48 object-cover"
    />
    <Badge
      variant={isExpired ? 'error' : currentAmount >= targetAmount ? 'success' : 'primary'}
      class="absolute top-4 right-4"
    >
      {isExpired ? 'Expired' : currentAmount >= targetAmount ? 'Funded' : 'Active'}
    </Badge>
  </div>

  <div class="p-4 space-y-4">
    <div>
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </div>

    <div class="space-y-2">
      <Progress value={progress} />
      <div class="flex justify-between text-sm">
        <span class="font-medium text-gray-900 dark:text-white">
          {formatCurrency(currentAmount)}
        </span>
        <span class="text-gray-600 dark:text-gray-400">
          of {formatCurrency(targetAmount)}
        </span>
      </div>
    </div>

    <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
      <span>{donorCount} donors</span>
      <span>Ends {formatDate(endDate)}</span>
    </div>

    <div class="pt-2">
      <Button
        variant="primary"
        fullWidth
        disabled={isExpired || currentAmount >= targetAmount}
        href={`/donate/${title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        {#if isExpired}
          Campaign Ended
        {:else if currentAmount >= targetAmount}
          Fully Funded
        {:else}
          Donate {formatCurrency(remainingAmount)} to go
        {/if}
      </Button>
    </div>
  </div>
</Card> 