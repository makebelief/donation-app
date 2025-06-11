<script lang="ts">
  import { onMount } from 'svelte';

  let formData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  let isSubmitting = false;
  let submitStatus = {
    success: false,
    message: ''
  };

  async function handleSubmit() {
    isSubmitting = true;
    submitStatus = {
      success: false,
      message: ''
    };

    try {
      // Here you would typically send the form data to your backend
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      submitStatus = {
        success: true,
        message: 'Thank you for your message. We will get back to you soon!'
      };
      
      formData = {
        name: '',
        email: '',
        subject: '',
        message: ''
      };
    } catch (error) {
      submitStatus = {
        success: false,
        message: 'Sorry, there was an error sending your message. Please try again.'
      };
    } finally {
      isSubmitting = false;
    }
  }
</script>

<svelte:head>
  <title>Contact Us - Donate</title>
</svelte:head>

<main class="min-h-screen">
  <div class="container mx-auto px-4 py-16">
    <div class="max-w-4xl mx-auto">
      <div class="contact-card">
        <h1 class="text-4xl md:text-5xl font-display font-bold mb-6 text-gray-800">
          Contact Us
        </h1>
        <p class="text-xl text-gray-200 mb-8">
          Have questions about Donate? We're here to help.
        </p>

        <form on:submit|preventDefault={handleSubmit} class="space-y-6">
          <div class="form-grid">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                id="name"
                bind:value={formData.name}
                required
                class="w-full px-4 py-2 bg-gray-50 border border-gray-200 text-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                placeholder="Your name"
              />
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                bind:value={formData.email}
                required
                class="w-full px-4 py-2 bg-gray-50 border border-gray-200 text-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label for="subject" class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              id="subject"
              bind:value={formData.subject}
              required
              class="w-full px-4 py-2 bg-gray-50 border border-gray-200 text-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
              placeholder="What is this about?"
            />
          </div>

          <div>
            <label for="message" class="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              id="message"
              bind:value={formData.message}
              required
              rows="4"
              class="w-full px-4 py-2 bg-gray-50 border border-gray-200 text-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
              placeholder="Your message here..."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            class="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {#if isSubmitting}
              Sending...
            {:else}
              Send Message
            {/if}
          </button>
        </form>
      </div>
    </div>
  </div>
</main>

<style>
  /* Custom styles */
  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .contact-card {
    @apply p-8 bg-white rounded-2xl border border-gray-100
    transform transition-all duration-300 hover:scale-[1.01] hover:bg-gray-50
    hover:border-gray-200 hover:shadow-xl;
  }

  /* Input focus styles */
  input:focus, textarea:focus {
    @apply ring-2 ring-blue-500 border-transparent outline-none;
  }

  /* Input hover styles */
  input:hover, textarea:hover {
    @apply border-gray-300;
  }
</style> 