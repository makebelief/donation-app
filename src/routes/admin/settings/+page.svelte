<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  let loading = true;
  let error = null;
  let success = false;
  let settings = {
    site: {
      name: 'Donate',
      description: 'Empowering change through transparent and impactful donations',
      contactEmail: '',
      supportPhone: '',
      address: ''
    },
    payment: {
      currency: 'KES',
      minimumDonation: 100,
      paymentMethods: ['mpesa', 'card', 'bank'],
      mpesaPaybill: '',
      stripePublicKey: '',
      stripeSecretKey: ''
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      adminEmails: [],
      newDonationAlert: true,
      projectUpdateAlert: true,
      monthlyReportEnabled: true
    },
    social: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: ''
    }
  };

  onMount(async () => {
    await loadSettings();
  });

  async function loadSettings() {
    try {
      const response = await fetch('/api/admin/settings');
      if (!response.ok) throw new Error('Failed to load settings');
      settings = await response.json();
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  async function saveSettings() {
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (!response.ok) throw new Error('Failed to save settings');
      success = true;
      setTimeout(() => success = false, 3000);
    } catch (err) {
      error = err.message;
    }
  }

  function addAdminEmail() {
    settings.notifications.adminEmails = [...settings.notifications.adminEmails, ''];
  }

  function removeAdminEmail(index: number) {
    settings.notifications.adminEmails = settings.notifications.adminEmails.filter((_, i) => i !== index);
  }
</script>

<div class="space-y-6">
  <div class="flex justify-between items-center">
    <h1 class="text-2xl font-semibold text-gray-900">Site Settings</h1>
    <button
      class="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors"
      on:click={saveSettings}
    >
      Save Changes
    </button>
  </div>

  {#if error}
    <div class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md" transition:fade>
      {error}
    </div>
  {/if}

  {#if success}
    <div class="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md" transition:fade>
      Settings saved successfully!
    </div>
  {/if}

  {#if loading}
    <div class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
    </div>
  {:else}
    <div class="bg-white shadow rounded-lg divide-y divide-gray-200">
      <!-- Site Information -->
      <div class="p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Site Information</h2>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label for="siteName" class="block text-sm font-medium text-gray-700">Site Name</label>
            <input
              type="text"
              id="siteName"
              bind:value={settings.site.name}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label for="contactEmail" class="block text-sm font-medium text-gray-700">Contact Email</label>
            <input
              type="email"
              id="contactEmail"
              bind:value={settings.site.contactEmail}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label for="supportPhone" class="block text-sm font-medium text-gray-700">Support Phone</label>
            <input
              type="tel"
              id="supportPhone"
              bind:value={settings.site.supportPhone}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label for="address" class="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              id="address"
              bind:value={settings.site.address}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div class="md:col-span-2">
            <label for="description" class="block text-sm font-medium text-gray-700">Site Description</label>
            <textarea
              id="description"
              bind:value={settings.site.description}
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Payment Settings -->
      <div class="p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Payment Settings</h2>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label for="currency" class="block text-sm font-medium text-gray-700">Currency</label>
            <select
              id="currency"
              bind:value={settings.payment.currency}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="KES">KES - Kenyan Shilling</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
            </select>
          </div>

          <div>
            <label for="minimumDonation" class="block text-sm font-medium text-gray-700">Minimum Donation</label>
            <input
              type="number"
              id="minimumDonation"
              bind:value={settings.payment.minimumDonation}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              min="0"
            />
          </div>

          <div>
            <label for="mpesaPaybill" class="block text-sm font-medium text-gray-700">M-Pesa Paybill</label>
            <input
              type="text"
              id="mpesaPaybill"
              bind:value={settings.payment.mpesaPaybill}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label for="stripePublicKey" class="block text-sm font-medium text-gray-700">Stripe Public Key</label>
            <input
              type="text"
              id="stripePublicKey"
              bind:value={settings.payment.stripePublicKey}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div class="md:col-span-2">
            <label for="stripeSecretKey" class="block text-sm font-medium text-gray-700">Stripe Secret Key</label>
            <input
              type="password"
              id="stripeSecretKey"
              bind:value={settings.payment.stripeSecretKey}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700">Payment Methods</label>
            <div class="mt-2 space-y-2">
              {#each ['mpesa', 'card', 'bank'] as method}
                <label class="inline-flex items-center">
                  <input
                    type="checkbox"
                    bind:group={settings.payment.paymentMethods}
                    value={method}
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span class="ml-2 text-sm text-gray-700">{method.toUpperCase()}</span>
                </label>
              {/each}
            </div>
          </div>
        </div>
      </div>

      <!-- Notification Settings -->
      <div class="p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Notification Settings</h2>
        <div class="space-y-6">
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  bind:checked={settings.notifications.emailNotifications}
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-2 text-sm text-gray-700">Enable Email Notifications</span>
              </label>
            </div>

            <div>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  bind:checked={settings.notifications.smsNotifications}
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-2 text-sm text-gray-700">Enable SMS Notifications</span>
              </label>
            </div>

            <div>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  bind:checked={settings.notifications.newDonationAlert}
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-2 text-sm text-gray-700">New Donation Alerts</span>
              </label>
            </div>

            <div>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  bind:checked={settings.notifications.projectUpdateAlert}
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-2 text-sm text-gray-700">Project Update Alerts</span>
              </label>
            </div>

            <div>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  bind:checked={settings.notifications.monthlyReportEnabled}
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-2 text-sm text-gray-700">Monthly Report Emails</span>
              </label>
            </div>
          </div>

          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="block text-sm font-medium text-gray-700">Admin Email Addresses</label>
              <button
                type="button"
                class="text-sm text-primary-600 hover:text-primary-500"
                on:click={addAdminEmail}
              >
                Add Email
              </button>
            </div>
            <div class="space-y-2">
              {#each settings.notifications.adminEmails as email, i}
                <div class="flex gap-2">
                  <input
                    type="email"
                    bind:value={settings.notifications.adminEmails[i]}
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="admin@example.com"
                  />
                  <button
                    type="button"
                    class="text-red-600 hover:text-red-500"
                    on:click={() => removeAdminEmail(i)}
                  >
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>

      <!-- Social Media Links -->
      <div class="p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Social Media Links</h2>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label for="facebook" class="block text-sm font-medium text-gray-700">Facebook</label>
            <input
              type="url"
              id="facebook"
              bind:value={settings.social.facebook}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="https://facebook.com/..."
            />
          </div>

          <div>
            <label for="twitter" class="block text-sm font-medium text-gray-700">Twitter</label>
            <input
              type="url"
              id="twitter"
              bind:value={settings.social.twitter}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="https://twitter.com/..."
            />
          </div>

          <div>
            <label for="instagram" class="block text-sm font-medium text-gray-700">Instagram</label>
            <input
              type="url"
              id="instagram"
              bind:value={settings.social.instagram}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="https://instagram.com/..."
            />
          </div>

          <div>
            <label for="linkedin" class="block text-sm font-medium text-gray-700">LinkedIn</label>
            <input
              type="url"
              id="linkedin"
              bind:value={settings.social.linkedin}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="https://linkedin.com/..."
            />
          </div>
        </div>
      </div>
    </div>
  {/if}
</div> 