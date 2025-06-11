&lt;script lang="ts">
  import { enhance } from '$app/forms';
  import Button from './Button.svelte';
  import Input from './Input.svelte';
  import Select from './Select.svelte';
  import Alert from './Alert.svelte';
  import { formatCurrency } from '$lib/utils/currency';
  import { fade } from 'svelte/transition';

  export let campaignTitle: string;
  export let minimumAmount = 5;
  export let suggestedAmounts = [10, 25, 50, 100, 250, 500];
  export let error: string | null = null;

  let loading = false;
  let customAmount = '';
  let selectedAmount: number | null = null;
  let paymentMethod = 'card';

  const paymentMethods = [
    { value: 'card', label: 'Credit/Debit Card' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'bank', label: 'Bank Transfer' }
  ];

  function setAmount(amount: number) {
    selectedAmount = amount;
    customAmount = amount.toString();
  }

  function validateForm() {
    const amount = Number(customAmount);
    if (isNaN(amount) || amount < minimumAmount) {
      error = `Minimum donation amount is ${formatCurrency(minimumAmount)}`;
      return false;
    }
    return true;
  }

  function handleSubmit(event: SubmitEvent) {
    if (!validateForm()) {
      event.preventDefault();
    }
    loading = true;
  }
&lt;/script>

&lt;form
  method="POST"
  action="?/donate"
  use:enhance={() => {
    return ({ result }) => {
      loading = false;
      if (result.type === 'error') {
        error = result.error?.message;
      }
    };
  }}
  on:submit={handleSubmit}
  class="space-y-6"
>
  {#if error}
    &lt;Alert type="error" message={error} transition={fade} />
  {/if}

  &lt;div class="space-y-4">
    &lt;h3 class="text-lg font-medium text-gray-900 dark:text-white">
      Donation Amount for {campaignTitle}
    &lt;/h3>

    &lt;div class="grid grid-cols-3 gap-3">
      {#each suggestedAmounts as amount}
        &lt;Button
          type="button"
          variant={selectedAmount === amount ? 'primary' : 'secondary'}
          on:click={() => setAmount(amount)}
        >
          {formatCurrency(amount)}
        &lt;/Button>
      {/each}
    &lt;/div>

    &lt;div class="relative">
      &lt;Input
        type="number"
        label="Custom Amount"
        name="amount"
        bind:value={customAmount}
        min={minimumAmount}
        step="0.01"
        required
        placeholder="Enter custom amount"
        disabled={loading}
      />
      &lt;span class="absolute left-3 top-9">$&lt;/span>
    &lt;/div>
  &lt;/div>

  &lt;div class="space-y-4">
    &lt;h3 class="text-lg font-medium text-gray-900 dark:text-white">
      Payment Method
    &lt;/h3>

    &lt;Select
      label="Select Payment Method"
      name="paymentMethod"
      bind:value={paymentMethod}
      options={paymentMethods}
      disabled={loading}
    />

    {#if paymentMethod === 'card'}
      &lt;Input
        type="text"
        label="Card Number"
        name="cardNumber"
        required
        placeholder="1234 5678 9012 3456"
        disabled={loading}
      />

      &lt;div class="grid grid-cols-2 gap-4">
        &lt;Input
          type="text"
          label="Expiry Date"
          name="expiryDate"
          required
          placeholder="MM/YY"
          disabled={loading}
        />

        &lt;Input
          type="text"
          label="CVC"
          name="cvc"
          required
          placeholder="123"
          disabled={loading}
        />
      &lt;/div>
    {/if}
  &lt;/div>

  &lt;Button
    type="submit"
    variant="primary"
    fullWidth
    loading={loading}
  >
    {loading ? 'Processing...' : `Donate ${formatCurrency(Number(customAmount) || 0)}`}
  &lt;/Button>
&lt;/form> 