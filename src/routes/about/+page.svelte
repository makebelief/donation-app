<script lang="ts">
  import { onMount } from 'svelte';
</script>

<svelte:head>
  <title>About Us - Donate</title>
</svelte:head>

<main class="min-h-screen">
  <div class="container mx-auto px-4 py-16">
    <div class="max-w-4xl mx-auto">
      <div class="about-card mb-12">
        <h1 class="text-4xl md:text-5xl font-display font-bold mb-6 text-white">
          About Donate
        </h1>
        <p class="text-xl text-gray-200 mb-8 lead">
          Donate is a platform dedicated to connecting donors with verified social projects.
          Our mission is to make giving more transparent, efficient, and impactful.
        </p>
        <p class="text-gray-200 mb-8">
          We believe that technology can bridge the gap between donors and communities in need,
          creating a more direct and meaningful connection that benefits everyone involved.
        </p>
      </div>

      <div class="about-card mb-12">
        <h2 class="text-3xl font-display font-bold mb-6 text-white">Our Core Values</h2>
        <ul class="list-disc pl-6 space-y-4 text-gray-200">
          <li><strong class="text-white">Transparency:</strong> We believe in complete openness about how funds are used and managed.</li>
          <li><strong class="text-white">Accountability:</strong> Regular reporting and updates ensure responsible use of donations.</li>
          <li><strong class="text-white">Empowerment:</strong> We focus on projects that build long-term capacity in communities.</li>
          <li><strong class="text-white">Innovation:</strong> Using technology to make giving more efficient and impactful.</li>
        </ul>
      </div>

      <div class="about-card">
        <h2 class="text-2xl font-display font-bold text-white mb-6">Join Us in Making a Difference</h2>
        <p class="mb-6 text-gray-200">
          Whether you're an individual donor, organization, or potential partner,
          there are many ways to get involved and support positive change in African communities.
        </p>
        <div class="flex flex-wrap gap-4">
          <a
            href="/projects"
            class="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl"
          >
            Browse Projects
          </a>
          <a
            href="/contact"
            class="inline-flex items-center px-6 py-3 bg-white text-gray-800 rounded-full hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl border border-gray-200"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  </div>
</main>

<style>
  /* Custom styles */
  .lead {
    font-weight: 300;
    line-height: 1.6;
  }

  .about-card {
    @apply p-8 bg-white rounded-2xl border border-gray-100
    transform transition-all duration-300 hover:scale-[1.01] hover:bg-gray-50
    hover:border-gray-200 hover:shadow-xl;
  }

  .about-card h1, .about-card h2 {
    @apply text-gray-800;
  }

  .about-card p {
    @apply text-gray-600;
  }

  .about-card ul {
    @apply text-gray-600;
  }

  .about-card strong {
    @apply text-gray-800;
  }
</style> 