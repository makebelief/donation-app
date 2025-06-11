<!-- src/routes/donate/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  
  let phoneNumber = '';
  let loading = false;
  let error = '';
  let success = '';
  let selectedAmount = '';
  let customAmount = '';
  let showSuccessModal = false;

  const predefinedAmounts = [
    { value: 500, label: '500' },
    { value: 1000, label: '1,000' },
    { value: 2500, label: '2,500' },
    { value: 5000, label: '5,000' },
    { value: 10000, label: '10,000' }
  ];

  function validatePhoneNumber(phone: string) {
    // Basic validation for Kenyan phone numbers
    const phoneRegex = /^(?:254|\+254|0)?([71](?:(?:[0-9][0-9])|(?:0[0-8]))[0-9]{6})$/;
    return phoneRegex.test(phone);
  }

  function formatPhoneNumber(phone: string) {
    // Remove any non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // Ensure the number starts with 254
    if (digits.startsWith('0')) {
      return '254' + digits.slice(1);
    } else if (!digits.startsWith('254')) {
      return '254' + digits;
    }
    return digits;
  }

  function handleAmountSelect(amount: number) {
    selectedAmount = amount.toString();
    customAmount = '';
  }

  function handleCustomAmount(event: Event) {
    selectedAmount = '';
    customAmount = (event.target as HTMLInputElement).value;
  }

  async function handleSubmit() {
    const amount = selectedAmount || customAmount;
    
    if (!amount || !phoneNumber) {
      error = 'Please fill in all required fields';
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      error = 'Please enter a valid Kenyan phone number';
      return;
    }

    loading = true;
    error = '';
    success = '';

    try {
      const response = await fetch('/api/mpesa/stkpush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          phoneNumber: formatPhoneNumber(phoneNumber)
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to process payment');
      }
      
      const result = await response.json();
      success = 'Please check your phone for the M-Pesa prompt to complete the payment.';
      showSuccessModal = true;
      
      // Start polling for payment status
      pollPaymentStatus(result.checkoutRequestId);
    } catch (err) {
      error = err.message || 'Failed to process payment. Please try again.';
    } finally {
      loading = false;
    }
  }

  async function pollPaymentStatus(checkoutRequestId: string) {
    const maxAttempts = 10;
    let attempts = 0;

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/mpesa/status/${checkoutRequestId}`);
        if (!response.ok) throw new Error('Failed to check payment status');
        
        const result = await response.json();
        if (result.status === 'COMPLETED') {
          goto('/thank-you');
          return;
        }
        
        if (result.status === 'FAILED') {
          error = 'Payment failed. Please try again.';
          return;
        }

        // Continue polling if payment is pending
        if (++attempts < maxAttempts) {
          setTimeout(checkStatus, 5000); // Check every 5 seconds
        }
      } catch (err) {
        console.error('Error checking payment status:', err);
      }
    };

    checkStatus();
  }

  function closeModal() {
    showSuccessModal = false;
  }
</script>

<div class="min-h-screen relative">
  <!-- Background Image -->
  <div class="fixed inset-0 z-0">
    <div class="absolute inset-0 bg-hero-pattern bg-cover bg-center bg-fixed"></div>
    <div class="absolute inset-0 bg-black/30"></div>
  </div>

  <!-- Content -->
  <div class="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <!-- Main Card -->
      <div class="bg-white/95 backdrop-blur-sm rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100">
        <!-- Header -->
        <div class="px-8 pt-12 pb-8 text-center">
          <h1 class="text-3xl font-bold text-gray-800 mb-3">Make a Donation</h1>
          <p class="text-gray-600 max-w-xl mx-auto">
            Your contribution helps create positive change in communities.
            Make a secure donation through M-Pesa.
          </p>
        </div>

        <div class="px-8 pb-12">
          <form on:submit|preventDefault={handleSubmit} class="space-y-8">
            <!-- Amount Selection -->
            <div class="space-y-3">
              <label class="block text-sm font-medium text-gray-700">Amount (KES)</label>
              <div class="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {#each predefinedAmounts as amount}
                  <button
                    type="button"
                    class="relative h-12 rounded-xl text-center transition-all duration-200 {selectedAmount === amount.value.toString() ? 'bg-blue-600 text-white font-medium shadow-lg scale-105' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}"
                    on:click={() => handleAmountSelect(amount.value)}
                  >
                    {amount.label}
                  </button>
                {/each}
              </div>
              
              <div class="relative mt-4">
                <input
                  type="number"
                  bind:value={customAmount}
                  on:input={handleCustomAmount}
                  class="w-full h-12 pl-16 pr-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                  placeholder="Custom amount"
                  min="100"
                />
                <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <span class="text-gray-500 font-medium">KES</span>
                </div>
              </div>
            </div>

            <!-- M-Pesa Section -->
            <div class="bg-gradient-to-r from-red-50 to-white rounded-xl p-6 space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <img src="/images/mpesa-logo.png" alt="M-Pesa Logo" class="h-10" />
                  <div class="hidden sm:block text-sm text-gray-600">
                    Secure Mobile Payment
                  </div>
                </div>
                <div class="flex items-center space-x-2 text-green-600">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span class="text-sm font-medium">Secure</span>
                </div>
              </div>

              <div class="relative">
                <input
                  type="tel"
                  bind:value={phoneNumber}
                  required
                  class="w-full h-12 pl-20 pr-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                  placeholder="712 345 678"
                  pattern="[0-9]{9}"
                />
                <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <span class="text-gray-500 font-medium">+254</span>
                </div>
              </div>

              <p class="text-sm text-gray-500 flex items-start space-x-2">
                <svg class="h-5 w-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>You'll receive a payment prompt on your phone. Enter your M-Pesa PIN to complete the donation.</span>
              </p>
            </div>

            {#if error}
              <div class="bg-red-50 text-red-600 p-4 rounded-xl text-sm">
                {error}
              </div>
            {/if}

            <!-- Submit Button -->
            <button
              type="submit"
              class="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              disabled={loading || (!selectedAmount && !customAmount) || !phoneNumber}
            >
              {#if loading}
                <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
              {:else}
                <span class="font-medium">Pay with M-Pesa</span>
              {/if}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Success Modal -->
{#if showSuccessModal}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-2xl p-8 max-w-md w-full transform transition-all duration-200">
      <div class="text-center">
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
          <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">Payment Initiated!</h3>
        <p class="text-gray-600 mb-6">
          Please check your phone for the M-Pesa prompt and enter your PIN to complete the donation.
        </p>
        <button
          on:click={closeModal}
          class="w-full inline-flex justify-center px-6 py-3 text-lg font-medium text-blue-600 hover:text-blue-500 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Remove number input spinners */
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }

  :global(body) {
    background-image: url('/images/wmremove-transformed.jpeg');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
  }
</style> 