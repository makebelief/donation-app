<!-- src/routes/thank-you/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  
  let project: any = null;
  let error = '';

  onMount(async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const projectId = urlParams.get('projectId');

      if (!projectId) {
        goto('/');
        return;
      }

      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) throw new Error('Failed to fetch project');
      project = await response.json();
    } catch (err) {
      error = 'Failed to load project details';
    }
  });
</script>

<div class="container mx-auto px-4 py-16 text-center">
  <div class="max-w-2xl mx-auto">
    <div class="mb-8">
      <svg class="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>

    <h1 class="text-4xl font-bold mb-4">Thank You for Your Donation!</h1>
    
    <p class="text-xl text-gray-600 mb-8">
      Your contribution will help make a difference.
    </p>

    {#if project}
      <div class="bg-gray-50 rounded-lg p-6 mb-8">
        <h2 class="text-2xl font-semibold mb-2">{project.title}</h2>
        <p class="text-gray-600 mb-4">{project.description}</p>
        <div class="flex justify-center gap-4">
          <div>
            <span class="block text-sm text-gray-500">Target Amount</span>
            <span class="text-lg font-semibold">KES {project.target_amount.toLocaleString()}</span>
          </div>
          <div>
            <span class="block text-sm text-gray-500">Amount Raised</span>
            <span class="text-lg font-semibold">KES {project.raised_amount.toLocaleString()}</span>
          </div>
        </div>
      </div>
    {/if}

    <div class="space-x-4">
      <a
        href="/"
        class="inline-block bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
      >
        Return Home
      </a>
      <a
        href="/projects"
        class="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
      >
        View More Projects
      </a>
    </div>
  </div>
</div> 