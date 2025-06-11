<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { fade, fly } from 'svelte/transition';
  
  let project = null;
  let loading = true;
  let error = null;
  let activeTab = 'overview';

  // Financial data
  let donations = [];
  let expenses = [];
  let updates = [];
  let impact = {
    beneficiariesReached: 0,
    completedMilestones: 0,
    totalMilestones: 0
  };

  onMount(async () => {
    try {
      // Simulated project data (replace with actual API call)
      const projects = {
        "1": {
          id: "1",
          title: "Clean Water Initiative in Zambia",
          description: "Supporting communities in Lufubu, Zambia with sustainable access to clean water through well construction and water purification systems. This initiative aims to improve health conditions and reduce waterborne diseases in the region. Our comprehensive approach includes community training on water management and maintenance of the installed systems.",
          image: "/images/projects/water_day_salesian_missions_lufubu_zambia_2017-1.jpg",
          raised_amount: 750000,
          target_amount: 1000000,
          location: "Lufubu, Zambia",
          impact: "5,000 people",
          completion: "75%",
          start_date: "2024-01-15",
          end_date: "2024-12-31",
          updates: [
            {
              date: "2024-03-01",
              title: "First Well Construction Complete",
              content: "Successfully completed the construction of our first community well. The local water management committee has been trained and the system is now operational, serving over 1,000 community members."
            },
            {
              date: "2024-02-15",
              title: "Community Training Program",
              content: "Conducted comprehensive water management and maintenance training for 50 community members. This ensures long-term sustainability of the water systems."
            }
          ],
          objectives: [
            "Construct 5 community wells in strategic locations across Lufubu",
            "Install water purification systems at each well site",
            "Train local communities in system maintenance and water management",
            "Establish community-led water management committees",
            "Reduce waterborne diseases by 60% in the target area"
          ]
        },
        "2": {
          id: "2",
          title: "School Equipment for Kenyan Students",
          description: "Equipping schools in Kenya with modern learning materials and essential equipment to enhance the quality of education. This project focuses on providing students with the tools they need for effective learning, including textbooks, laboratory equipment, computers, and basic classroom furniture. Our goal is to create an environment that fosters learning and academic excellence.",
          image: "/images/projects/kenyan school equipment.jpg",
          raised_amount: 450000,
          target_amount: 800000,
          location: "Nairobi, Kenya",
          impact: "1,200 students",
          completion: "56%",
          start_date: "2024-02-01",
          end_date: "2024-11-30",
          updates: [
            {
              date: "2024-03-10",
              title: "First Batch of Equipment Delivered",
              content: "Successfully delivered and installed new computer equipment and learning materials in three schools, benefiting over 500 students."
            },
            {
              date: "2024-02-20",
              title: "Teacher Training Workshop",
              content: "Conducted training sessions for 25 teachers on utilizing the new equipment and integrating technology into their teaching methods."
            }
          ],
          objectives: [
            "Provide modern textbooks and learning materials to 10 schools",
            "Set up computer labs with internet access",
            "Supply basic classroom furniture and equipment",
            "Train teachers in using new educational technologies",
            "Create a sustainable equipment maintenance program"
          ]
        }
      };

      project = projects[$page.params.id];
      if (!project) {
        throw new Error("Project not found");
      }
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

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
</script>

<svelte:head>
  {#if project}
    <title>{project.title} - Donate</title>
  {:else}
    <title>Project Details - Donate</title>
  {/if}
</svelte:head>

<div class="min-h-screen relative">
  <!-- Background with overlay -->
  <div class="fixed inset-0 z-0">
    <div class="absolute inset-0 bg-hero-pattern bg-cover bg-center bg-fixed"></div>
    <div class="absolute inset-0 bg-black/30"></div>
  </div>

  <!-- Content -->
  <div class="relative z-10 container mx-auto px-4 py-16">
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
      <div class="max-w-5xl mx-auto">
        <!-- Back Button -->
        <a 
          href="/projects"
          class="inline-flex items-center text-white mb-8 hover:text-blue-200 transition-colors"
          in:fade
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Back to Projects
        </a>

        <!-- Main Content -->
        <div class="bg-white/95 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl" in:fly="{{ y: 50, duration: 1000 }}">
          <!-- Hero Section -->
          <div class="relative h-96">
            <img
              src={project.image}
              alt={project.title}
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div class="absolute bottom-0 left-0 right-0 p-8">
              <h1 class="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                {project.title}
              </h1>
              <div class="flex items-center text-white/90">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                {project.location}
              </div>
            </div>
          </div>

          <div class="p-8">
            <!-- Progress Section -->
            <div class="bg-gray-50 rounded-2xl p-6 mb-8">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div class="text-sm text-gray-500 mb-1">Raised</div>
                  <div class="text-2xl font-bold text-gray-900">{formatAmount(project.raised_amount)}</div>
                </div>
                <div>
                  <div class="text-sm text-gray-500 mb-1">Goal</div>
                  <div class="text-2xl font-bold text-gray-900">{formatAmount(project.target_amount)}</div>
                </div>
                <div>
                  <div class="text-sm text-gray-500 mb-1">Impact</div>
                  <div class="text-2xl font-bold text-gray-900">{project.impact}</div>
                </div>
              </div>

              <div class="mt-6">
                <div class="relative w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    class="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                    style="width: {Math.min(100, Math.round((project.raised_amount / project.target_amount) * 100))}%"
                  >
                    <div class="absolute inset-0 bg-[length:8px_8px] bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] animate-[progress_1s_linear_infinite]"></div>
                  </div>
                </div>
                <div class="mt-2 text-center text-sm text-gray-600">
                  Project is {project.completion} complete
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="prose prose-lg max-w-none mb-12">
              <h2 class="text-3xl font-display font-bold text-gray-900 mb-6">About This Project</h2>
              <p class="text-gray-600">{project.description}</p>
            </div>

            <!-- Objectives -->
            <div class="mb-12">
              <h2 class="text-3xl font-display font-bold text-gray-900 mb-6">Project Objectives</h2>
              <ul class="space-y-4">
                {#each project.objectives as objective}
                  <li class="flex items-start">
                    <svg class="w-6 h-6 text-green-500 flex-shrink-0 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span class="text-gray-600">{objective}</span>
                  </li>
                {/each}
              </ul>
            </div>

            <!-- Timeline -->
            <div class="mb-12">
              <h2 class="text-3xl font-display font-bold text-gray-900 mb-6">Project Timeline</h2>
              <div class="flex justify-between items-center mb-8">
                <div>
                  <div class="text-sm text-gray-500">Start Date</div>
                  <div class="text-lg font-medium text-gray-900">{formatDate(project.start_date)}</div>
                </div>
                <div class="h-0.5 flex-1 bg-gray-200 mx-4"></div>
                <div class="text-right">
                  <div class="text-sm text-gray-500">End Date</div>
                  <div class="text-lg font-medium text-gray-900">{formatDate(project.end_date)}</div>
                </div>
              </div>
            </div>

            <!-- Updates -->
            <div class="mb-12">
              <h2 class="text-3xl font-display font-bold text-gray-900 mb-6">Project Updates</h2>
              <div class="space-y-6">
                {#each project.updates as update}
                  <div class="bg-gray-50 rounded-xl p-6">
                    <div class="flex items-center justify-between mb-3">
                      <h3 class="text-xl font-bold text-gray-900">{update.title}</h3>
                      <span class="text-sm text-gray-500">{formatDate(update.date)}</span>
                    </div>
                    <p class="text-gray-600">{update.content}</p>
                  </div>
                {/each}
              </div>
            </div>

            <!-- Call to Action -->
            <div class="flex justify-center">
              <a
                href="/donate?project={project.id}"
                class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 font-medium text-lg"
              >
                Support This Project
                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
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
</style> 