<script lang="ts">
  import '../app.postcss';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';

  let isScrolled = false;
  let isMenuOpen = false;
  let isAdmin = false; // This will be set based on authentication

  onMount(() => {
    const handleScroll = () => {
      isScrolled = window.scrollY > 20;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });
</script>

<div class="min-h-screen relative">
  <!-- Fixed background wrapper -->
  <div class="fixed inset-0 z-0">
    <div class="absolute inset-0 bg-hero-pattern bg-cover bg-center bg-fixed"></div>
    <div class="absolute inset-0 bg-black/30"></div>
  </div>
  
  <!-- Navigation -->
  <nav
    class="fixed w-full z-50 transition-all duration-300"
    class:bg-white={isScrolled}
    class:bg-opacity-90={isScrolled}
    class:backdrop-blur-sm={isScrolled}
    class:bg-transparent={!isScrolled}
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <a href="/" class="flex items-center space-x-2">
            <span class="text-2xl font-display font-bold {isScrolled ? 'text-primary-600' : 'text-white'}">
              Donate
            </span>
          </a>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <a
            href="/"
            class="font-medium {isScrolled ? 'text-gray-600 hover:text-primary-600' : 'text-white hover:text-primary-200'} transition"
            class:font-semibold={$page.url.pathname === '/'}
          >
            Home
          </a>
          <a
            href="/projects"
            class="font-medium {isScrolled ? 'text-gray-600 hover:text-primary-600' : 'text-white hover:text-primary-200'} transition"
            class:font-semibold={$page.url.pathname.startsWith('/projects')}
          >
            Projects
          </a>
          <a
            href="/about"
            class="font-medium {isScrolled ? 'text-gray-600 hover:text-primary-600' : 'text-white hover:text-primary-200'} transition"
            class:font-semibold={$page.url.pathname === '/about'}
          >
            About
          </a>
          <a
            href="/contact"
            class="font-medium {isScrolled ? 'text-gray-600 hover:text-primary-600' : 'text-white hover:text-primary-200'} transition"
            class:font-semibold={$page.url.pathname === '/contact'}
          >
            Contact
          </a>
          {#if isAdmin}
            <a
              href="/admin"
              class="px-6 py-2 bg-gradient-to-r from-accent-600 to-accent-500 text-white font-semibold rounded-full hover:from-accent-700 hover:to-accent-600 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Admin Dashboard
            </a>
          {:else}
            <a
              href="/donate"
              class="px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-full hover:from-primary-700 hover:to-primary-600 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Donate Now
            </a>
          {/if}
        </div>

        <!-- Mobile Menu Button -->
        <button
          class="md:hidden {isScrolled ? 'text-gray-600' : 'text-white'}"
          on:click={() => isMenuOpen = !isMenuOpen}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    {#if isMenuOpen}
      <div
        class="md:hidden bg-white/95 backdrop-blur-sm shadow-xl"
        transition:fly={{ y: -20, duration: 200 }}
      >
        <div class="px-2 pt-2 pb-3 space-y-1">
          <a
            href="/"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50"
            class:bg-primary-50={$page.url.pathname === '/'}
            on:click={() => isMenuOpen = false}
          >
            Home
          </a>
          <a
            href="/projects"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50"
            class:bg-primary-50={$page.url.pathname.startsWith('/projects')}
            on:click={() => isMenuOpen = false}
          >
            Projects
          </a>
          <a
            href="/about"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50"
            class:bg-primary-50={$page.url.pathname === '/about'}
            on:click={() => isMenuOpen = false}
          >
            About
          </a>
          <a
            href="/contact"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50"
            class:bg-primary-50={$page.url.pathname === '/contact'}
            on:click={() => isMenuOpen = false}
          >
            Contact
          </a>
          {#if isAdmin}
            <a
              href="/admin"
              class="block px-3 py-2 rounded-md text-base font-medium bg-accent-500 text-white hover:bg-accent-600"
              on:click={() => isMenuOpen = false}
            >
              Admin Dashboard
            </a>
          {:else}
            <a
              href="/donate"
              class="block px-3 py-2 rounded-md text-base font-medium bg-primary-500 text-white hover:bg-primary-600"
              on:click={() => isMenuOpen = false}
            >
              Donate Now
            </a>
          {/if}
        </div>
      </div>
    {/if}
  </nav>

  <!-- Main Content -->
  <main class="min-h-screen pt-16 relative z-10">
    <slot />
  </main>

  <!-- Footer -->
  <footer class="bg-gray-900/95 backdrop-blur-sm text-white relative z-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- About Section -->
        <div class="col-span-1 md:col-span-2">
          <h3 class="text-2xl font-display font-bold text-primary-400 mb-4">Donate</h3>
          <p class="text-gray-300 mb-4">
            Empowering communities through transparent and secure donations.
            Together we can make a difference in the lives of those who need it most.
          </p>
          <div class="flex space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-primary-400">
              <span class="sr-only">Facebook</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-primary-400">
              <span class="sr-only">Twitter</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-primary-400">
              <span class="sr-only">Instagram</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-semibold text-primary-400 mb-4">Quick Links</h3>
          <ul class="space-y-2">
            <li><a href="/projects" class="text-gray-300 hover:text-primary-400">Projects</a></li>
            <li><a href="/about" class="text-gray-300 hover:text-primary-400">About Us</a></li>
            <li><a href="/contact" class="text-gray-300 hover:text-primary-400">Contact</a></li>
            <li><a href="/donate" class="text-gray-300 hover:text-primary-400">Donate</a></li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div>
          <h3 class="text-lg font-semibold text-primary-400 mb-4">Stay Updated</h3>
          <form class="space-y-4">
            <div>
              <label for="email" class="sr-only">Email address</label>
              <input
                type="email"
                id="email"
                name="email"
                class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
            <button
              type="submit"
              class="w-full px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div class="text-center text-sm text-gray-400 mt-8">
        <p>&copy; {new Date().getFullYear()} Donate. All rights reserved.</p>
      </div>
    </div>
  </footer>
</div>

<style>
  /* Add any custom styles here */
  nav {
    backdrop-filter: blur(5px);
  }
  
  .bg-transparent {
    background-color: rgba(0, 0, 0, 0.1);
  }
</style> 