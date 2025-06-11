<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  
  let projects = [];
  let loading = true;
  let error = null;
  let searchQuery = '';
  let selectedCategory = 'all';
  let selectedSDG = 'all';
  let sortBy = 'latest';

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'education', name: 'Education' },
    { id: 'health', name: 'Healthcare' },
    { id: 'environment', name: 'Environment' },
    { id: 'community', name: 'Community Development' },
    { id: 'agriculture', name: 'Agriculture' },
    { id: 'technology', name: 'Technology' }
  ];

  // SDGs for filtering
  let sdgs = [];

  onMount(async () => {
    try {
      // Simulated project data (replace with actual API call)
      projects = [
        {
          id: 1,
          title: "Clean Water Initiative in Zambia",
          description: "Supporting communities in Lufubu, Zambia with sustainable access to clean water through well construction and water purification systems. This initiative aims to improve health conditions and reduce waterborne diseases in the region.",
          image: "/images/projects/water_day_salesian_missions_lufubu_zambia_2017-1.jpg",
          raised_amount: 750000,
          target_amount: 1000000,
          location: "Lufubu, Zambia",
          impact: "5,000 people",
          completion: "75%"
        },
        {
          id: 2,
          title: "School Equipment for Kenyan Students",
          description: "Equipping schools in Kenya with modern learning materials and essential equipment to enhance the quality of education. This project focuses on providing students with the tools they need for effective learning.",
          image: "/images/projects/kenyan school equipment.jpg",
          raised_amount: 450000,
          target_amount: 800000,
          location: "Nairobi, Kenya",
          impact: "1,200 students",
          completion: "56%"
        }
      ];
      loading = false;
    } catch (e) {
      error = e.message;
      loading = false;
    }
  });

  function formatAmount(amount: number) {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0
    }).format(amount);
  }

  // Filter and sort projects
  $: filteredProjects = projects
    .filter(project => {
      const matchesSearch = searchQuery === '' || 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || 
        project.category === selectedCategory;
      
      const matchesSDG = selectedSDG === 'all' || 
        (project.sdgs && project.sdgs.some(sdg => sdg.id === selectedSDG));
      
      return matchesSearch && matchesCategory && matchesSDG;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'most-funded':
          return b.raised_amount - a.raised_amount;
        case 'least-funded':
          return a.raised_amount - b.raised_amount;
        case 'goal-highest':
          return b.target_amount - a.target_amount;
        case 'goal-lowest':
          return a.target_amount - b.target_amount;
        default:
          return 0;
      }
    });
</script>

<svelte:head>
  <title>Browse Projects - Donate</title>
</svelte:head>

<div class="min-h-screen relative">
  <!-- Background with overlay -->
  <div class="fixed inset-0 z-0">
    <div class="absolute inset-0 bg-hero-pattern bg-cover bg-center bg-fixed"></div>
    <div class="absolute inset-0 bg-black/30"></div>
  </div>

  <!-- Content -->
  <div class="relative z-10 container mx-auto px-4 py-16">
    <!-- Header Section -->
    <div class="text-center mb-16" in:fly="{{ y: 50, duration: 1000 }}">
      <h1 class="text-5xl md:text-6xl font-display font-bold text-white mb-6">
        Our Projects
        </h1>
      <p class="text-xl text-gray-200 max-w-3xl mx-auto">
        Explore our impactful initiatives and help us make a difference in communities.
        Every contribution brings us closer to our goals.
        </p>
      </div>

      <!-- Projects Grid -->
      {#if loading}
        <div class="flex justify-center items-center min-h-[400px]">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      {:else if error}
      <div class="bg-red-900/40 backdrop-blur-sm border border-red-500 rounded-xl p-8 text-center">
        <p class="text-red-200 text-lg">{error}</p>
          <button 
          class="mt-6 px-8 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all transform hover:scale-105"
            on:click={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      {:else}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {#each projects as project, i}
          <article 
            class="group bg-white/95 backdrop-blur-sm rounded-3xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
            in:fly="{{ y: 50, duration: 800, delay: i * 200 }}"
          >
            <div class="relative h-64 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                class="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div class="absolute bottom-0 left-0 right-0 p-6">
                <h2 class="text-3xl font-display font-bold text-white mb-2">
                    {project.title}
                </h2>
                <div class="flex items-center text-white/90 text-sm">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  {project.location}
                </div>
                    </div>
                  </div>

            <div class="p-8">
              <p class="text-gray-600 text-lg mb-6 line-clamp-3">
                {project.description}
              </p>

              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-2">
                  <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                  <span class="text-gray-600">Impact: {project.impact}</span>
                </div>
                <span class="px-4 py-1 bg-blue-500 text-white rounded-full text-sm font-medium">
                  {project.completion} Complete
                </span>
                    </div>

              <!-- Progress bar -->
              <div class="relative w-full h-3 bg-gray-100 rounded-full mb-4 overflow-hidden">
                <div
                  class="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                  style="width: {Math.min(100, Math.round((project.raised_amount / project.target_amount) * 100))}%"
                >
                  <div class="absolute inset-0 bg-[length:8px_8px] bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] animate-[progress_1s_linear_infinite]"></div>
                    </div>
                  </div>

              <div class="flex justify-between items-baseline text-sm mb-8">
                <div>
                  <span class="text-2xl font-bold text-gray-800">{formatAmount(project.raised_amount)}</span>
                  <span class="text-gray-500 ml-1">raised</span>
                </div>
                <span class="text-gray-600">Goal: {formatAmount(project.target_amount)}</span>
                  </div>

              <div class="flex gap-4">
                  <a
                    href="/projects/{project.id}"
                  class="flex-1 text-center px-6 py-3 bg-gray-50 text-gray-800 rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 font-medium"
                  >
                  Learn More
                  </a>
                  <a
                  href="/donate?project={project.id}"
                  class="flex-1 text-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 font-medium"
                  >
                  Donate Now
                  </a>
                </div>
              </div>
            </article>
          {/each}
        </div>
      {/if}
    </div>
  </div>

<style>
  /* Remove the global body background since we're using a fixed background div */
  :global(body) {
    background-color: transparent;
  }

  /* Custom animation for progress bar stripes */
  @keyframes progress {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 16px 0;
    }
  }

  /* Text truncation */
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style> 