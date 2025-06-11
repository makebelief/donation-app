<script lang="ts">
  import { onMount } from 'svelte';
  
  let stats = {
    projectCount: 0,
    totalRaised: 0,
    successRate: 0,
    beneficiariesReached: 0
  };

  function formatAmount(amount) {
    if (amount >= 1000000) {
      return `KSh ${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `KSh ${(amount / 1000).toFixed(0)}K`;
    }
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  }

  function formatNumber(number) {
    if (number >= 1000000) {
      return `${(number / 1000000).toFixed(1)}M`;
    } else if (number >= 1000) {
      return `${(number / 1000).toFixed(0)}K`;
    }
    return number.toLocaleString();
  }

  onMount(async () => {
    try {
      // Calculate stats from our current projects
      stats = {
        projectCount: 2,
        totalRaised: 1200000, // 750,000 + 450,000
        successRate: 65, // Average of 75% and 56%
        beneficiariesReached: 6200 // 5,000 + 1,200
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  });
</script>

<svelte:head>
  <title>Donate - Transparent Donations for Social Projects</title>
</svelte:head>

<main class="min-h-screen">
  <!-- Hero Section -->
  <section class="relative overflow-hidden text-white min-h-[80vh] flex items-center">
    <div class="container mx-auto px-4 relative py-16">
      <div class="max-w-3xl">
        <h1 class="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
          Transparent Giving, <br/>Lasting Impact
        </h1>
        <p class="text-xl md:text-2xl mb-8 text-gray-200">
          Support verified social projects across Africa with complete transparency. 
          Track your impact and see exactly how your donation makes a difference.
        </p>
        <div class="flex flex-wrap gap-4">
          <a 
            href="/projects"
            class="inline-flex items-center px-8 py-4 bg-white text-blue-700 rounded-full font-semibold hover:bg-blue-100 transition-colors shadow-lg hover:shadow-xl"
          >
            Browse Projects
          </a>
          <a 
            href="/about#transparency"
            class="inline-flex items-center px-8 py-4 border-2 border-white bg-black/30 text-blue-300 rounded-full font-semibold hover:bg-white hover:text-blue-700 transition-colors"
          >
            Our Transparency
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- How It Works -->
  <section class="py-20">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl md:text-4xl font-display font-bold text-center mb-12 text-white">
        How Donate Works
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div class="tile-card group">
          <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors">Verified Projects</h3>
          <p class="text-gray-600">
            We thoroughly vet each project and organization to ensure legitimacy and impact potential.
          </p>
        </div>

        <div class="tile-card group">
          <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors">Secure Donations</h3>
          <p class="text-gray-600">
            Make secure donations via M-Pesa with instant confirmation and tracking.
          </p>
        </div>

        <div class="tile-card group">
          <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors">Track Impact</h3>
          <p class="text-gray-600">
            Receive regular updates and see exactly how your donation is making a difference.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Impact Stats -->
  <section class="py-20">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl md:text-4xl font-display font-bold text-center mb-12 text-white">
        Our Impact So Far
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
        <div class="stats-card group">
          <div class="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">{stats.projectCount}</div>
          <p class="text-gray-200">Active Projects</p>
        </div>

        <div class="stats-card group">
          <div class="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">{formatAmount(stats.totalRaised)}</div>
          <p class="text-gray-200">Total Raised</p>
        </div>

        <div class="stats-card group">
          <div class="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">{stats.successRate}%</div>
          <p class="text-gray-200">Success Rate</p>
        </div>

        <div class="stats-card group">
          <div class="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">{formatNumber(stats.beneficiariesReached)}</div>
          <p class="text-gray-200">Lives Impacted</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Transparency Section -->
  <section class="py-20">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl md:text-4xl font-display font-bold mb-6 text-white">
          Transparency at Every Step
        </h2>
        <p class="text-xl text-gray-200 mb-12">
          We believe in complete transparency. Track every shilling from donation to impact.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="transparency-card">
            <h3 class="text-xl font-semibold mb-4 text-white">Financial Transparency</h3>
            <ul class="text-left space-y-3 text-gray-200">
              <li class="flex items-start">
                <svg class="h-6 w-6 text-green-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Real-time fund tracking
              </li>
              <li class="flex items-start">
                <svg class="h-6 w-6 text-green-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Detailed expense reports
              </li>
              <li class="flex items-start">
                <svg class="h-6 w-6 text-green-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Transaction verification
              </li>
            </ul>
          </div>

          <div class="transparency-card">
            <h3 class="text-xl font-semibold mb-4 text-white">Project Transparency</h3>
            <ul class="text-left space-y-3 text-gray-200">
              <li class="flex items-start">
                <svg class="h-6 w-6 text-green-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Regular progress updates
              </li>
              <li class="flex items-start">
                <svg class="h-6 w-6 text-green-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Photo and video documentation
              </li>
              <li class="flex items-start">
                <svg class="h-6 w-6 text-green-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Impact measurement reports
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Call to Action -->
  <section class="py-20">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto bg-gradient-to-r from-ochre-600 to-ochre-700 rounded-3xl p-12 text-center text-white relative overflow-hidden">
        <div class="absolute inset-0 bg-pattern opacity-10"></div>
        <div class="relative">
          <h2 class="text-3xl md:text-4xl font-display font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p class="text-xl text-ochre-100 mb-8 max-w-2xl mx-auto">
            Join us in creating lasting positive change in African communities through transparent and impactful giving.
          </p>
          <div class="flex flex-wrap gap-4 justify-center">
            <a 
              href="/donate"
              class="inline-flex items-center px-8 py-4 bg-white/90 text-blue-700 rounded-full font-semibold hover:bg-white transition-colors shadow-lg hover:shadow-xl"
            >
              Donate Now
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>

<style>
  /* Custom color variables */
  :root {
    --color-ochre-200: #fbd38d;
    --color-ochre-500: #ed8936;
    --color-ochre-600: #dd6b20;
    --color-ochre-900: #7b341e;
    --color-warmth-100: #fffaf0;
  }

  /* African-inspired patterns */
  .bg-pattern {
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }

  /* Custom font for headers */
  .font-display {
    font-family: 'Montserrat', sans-serif;
  }

  /* Modern card styles */
  .tile-card {
    @apply text-center p-8 bg-white rounded-2xl border border-gray-100
    transform transition-all duration-300 hover:scale-[1.02] hover:bg-gray-50
    hover:border-gray-200 hover:shadow-xl hover:-translate-y-1;
  }

  .tile-card h3 {
    @apply text-gray-800 group-hover:text-blue-600;
  }

  .tile-card p {
    @apply text-gray-600;
  }

  .stats-card {
    @apply bg-black/30 backdrop-blur-sm rounded-2xl p-6 text-center
    transform transition-all duration-300 hover:scale-105 hover:bg-black/40;
  }

  .stats-card div {
    @apply truncate;
  }

  .stats-card p {
    @apply text-gray-200;
  }

  .transparency-card {
    @apply p-8 bg-white rounded-2xl border border-gray-100
    transform transition-all duration-300 hover:scale-[1.02] hover:bg-gray-50
    hover:border-gray-200 hover:shadow-xl hover:-translate-y-1;
  }

  .transparency-card h3 {
    @apply text-gray-800;
  }

  .transparency-card p, .transparency-card li {
    @apply text-gray-600;
  }
</style> 