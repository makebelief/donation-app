<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: 'chart-bar' },
    { href: '/admin/projects', label: 'Projects', icon: 'folder' },
    { href: '/admin/donations', label: 'Donations', icon: 'cash' },
    { href: '/admin/users', label: 'Users', icon: 'users' },
    { href: '/admin/settings', label: 'Settings', icon: 'cog' }
  ];

  async function handleLogout() {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST'
      });
      
      if (response.ok) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
</script>

<div class="min-h-screen bg-gray-50">
  <!-- Top Navigation -->
  <nav class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <a href="/" class="text-2xl font-bold text-ochre-900">
              African Social Projects
            </a>
          </div>
        </div>
        <div class="flex items-center">
          <button 
            on:click={handleLogout}
            class="text-gray-600 hover:text-gray-900"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>

  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex">
        <!-- Sidebar Navigation -->
        <div class="w-64 mr-8">
          <nav class="space-y-1">
            {#each navItems as item}
              <a
                href={item.href}
                class="group flex items-center px-3 py-2 text-sm font-medium rounded-md {$page.url.pathname === item.href ? 'bg-ochre-100 text-ochre-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}"
              >
                <span class="truncate">{item.label}</span>
              </a>
            {/each}
          </nav>
        </div>

        <!-- Main Content -->
        <div class="flex-1">
          <slot />
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  /* Add any custom styles here */
</style> 