<script lang="ts">
  import { onMount } from 'svelte';
  import type { Project, Donation } from '$lib/db';
  import { fade } from 'svelte/transition';

  let projects: Project[] = [];
  let selectedProject: Project | null = null;
  let donations: Donation[] = [];
  let loading = {
    dashboard: true,
    projects: false,
    donations: false,
    action: false
  };
  let errors = {
    dashboard: '',
    projects: '',
    donations: '',
    action: ''
  };
  let success = '';

  // Form data for new project
  let newProject = {
    title: '',
    description: '',
    target_amount: ''
  };

  // Form data for project update
  let newUpdate = {
    title: '',
    content: ''
  };

  let isLoading = true;
  let stats = {
    totalDonations: 0,
    totalAmount: 0,
    activeProjects: 0,
    successRate: 0,
    monthlyGrowth: 0,
    averageDonation: 0,
    totalImpact: 0
  };
  let recentTransactions: any[] = [];
  let projectMetrics: any[] = [];

  let recentDonations = [];
  let recentProjects = [];

  onMount(async () => {
    await loadDashboard();
  });

  async function loadDashboard() {
    loading.dashboard = true;
    errors.dashboard = '';
    
    try {
      const response = await fetch('/api/admin/dashboard');
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch dashboard data');
      }
      const data = await response.json();
      stats = data;
      recentDonations = data.recentDonations;
      recentProjects = data.recentProjects;
    } catch (err) {
      errors.dashboard = err.message;
      console.error('Dashboard error:', err);
    } finally {
      loading.dashboard = false;
    }
  }

  async function loadProjects() {
    try {
      const response = await fetch('/api/projects');
      projects = await response.json();
    } catch (err) {
      errors.projects = 'Failed to load projects';
    } finally {
      loading.projects = false;
    }
  }

  async function loadProjectDonations(projectId: number) {
    loading.donations = true;
    try {
      const response = await fetch(`/api/projects/${projectId}/donations`);
      donations = await response.json();
    } catch (err) {
      errors.donations = 'Failed to load donations';
    } finally {
      loading.donations = false;
    }
  }

  async function handleProjectSubmit() {
    loading.action = true;
    errors.action = '';
    success = '';

    try {
      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: newProject.title,
          description: newProject.description,
          target_amount: Number(newProject.target_amount)
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create project');
      }

      success = 'Project created successfully';
      newProject = {
        title: '',
        description: '',
        target_amount: ''
      };
      await loadDashboard();
    } catch (err) {
      errors.action = err.message;
      console.error('Project creation error:', err);
    } finally {
      loading.action = false;
    }
  }

  async function handleUpdateSubmit(projectId) {
    loading.action = true;
    errors.action = '';
    success = '';

    try {
      const response = await fetch(`/api/admin/projects/${projectId}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUpdate)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add update');
      }

      success = 'Update added successfully';
      newUpdate = {
        title: '',
        content: ''
      };
      await loadDashboard();
    } catch (err) {
      errors.action = err.message;
      console.error('Project update error:', err);
    } finally {
      loading.action = false;
    }
  }

  function formatAmount(amount: number) {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  }

  function formatNumber(num: number) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }
</script>

<svelte:head>
  <title>Admin Dashboard - African Social Projects</title>
</svelte:head>

<main class="min-h-screen bg-gradient-to-b from-warmth-100 to-white py-12">
  <div class="container mx-auto px-4">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-4xl font-display font-bold text-ochre-900 mb-8">Admin Dashboard</h1>

      {#if errors.dashboard}
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p class="font-medium">Error loading dashboard</p>
          <p>{errors.dashboard}</p>
        </div>
      {/if}

      {#if loading.dashboard}
        <div class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-ochre-900"></div>
        </div>
      {:else}
        <div class="space-y-6">
          <h1 class="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>

          <!-- Stats Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-blue-100 text-blue-600">
                  <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">Total Donations</p>
                  <p class="text-lg font-semibold text-gray-900">{formatCurrency(stats.totalDonations)}</p>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-green-100 text-green-600">
                  <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">Active Projects</p>
                  <p class="text-lg font-semibold text-gray-900">{stats.activeProjects}</p>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-purple-100 text-purple-600">
                  <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">Lives Impacted</p>
                  <p class="text-lg font-semibold text-gray-900">{formatNumber(stats.totalImpact)}</p>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
                  <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">Success Rate</p>
                  <p class="text-lg font-semibold text-gray-900">{stats.successRate}%</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Recent Donations -->
            <div class="bg-white rounded-lg shadow">
              <div class="p-6">
                <h2 class="text-lg font-medium text-gray-900">Recent Donations</h2>
                <div class="mt-4">
                  {#if recentDonations.length > 0}
                    <div class="space-y-4">
                      {#each recentDonations as donation}
                        <div class="flex items-center justify-between">
                          <div>
                            <p class="text-sm font-medium text-gray-900">{donation.donor}</p>
                            <p class="text-sm text-gray-500">{donation.project}</p>
                          </div>
                          <div class="text-right">
                            <p class="text-sm font-medium text-gray-900">{formatCurrency(donation.amount)}</p>
                            <p class="text-sm text-gray-500">{new Date(donation.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                      {/each}
                    </div>
                  {:else}
                    <p class="text-gray-500 text-sm">No recent donations</p>
                  {/if}
                </div>
              </div>
            </div>

            <!-- Recent Projects -->
            <div class="bg-white rounded-lg shadow">
              <div class="p-6">
                <h2 class="text-lg font-medium text-gray-900">Recent Projects</h2>
                <div class="mt-4">
                  {#if recentProjects.length > 0}
                    <div class="space-y-4">
                      {#each recentProjects as project}
                        <div class="flex items-center justify-between">
                          <div>
                            <p class="text-sm font-medium text-gray-900">{project.title}</p>
                            <div class="flex items-center mt-1">
                              <div class="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  class="bg-blue-600 h-2 rounded-full"
                                  style="width: {project.progress}%"
                                ></div>
                              </div>
                              <span class="ml-2 text-sm text-gray-500">{project.progress}%</span>
                            </div>
                          </div>
                          <div class="text-right">
                            <p class="text-sm font-medium text-gray-900">{formatCurrency(project.raised)}</p>
                            <p class="text-sm text-gray-500">of {formatCurrency(project.goal)}</p>
                          </div>
                        </div>
                      {/each}
                    </div>
                  {:else}
                    <p class="text-gray-500 text-sm">No recent projects</p>
                  {/if}
                </div>
              </div>
            </div>
          </div>
        </div>
      {/if}

      <!-- Create New Project -->
      <div class="bg-white rounded-2xl shadow-xl p-8 mb-8 mt-8">
        <h2 class="text-2xl font-display font-bold text-ochre-900 mb-6">Create New Project</h2>
        
        {#if errors.action}
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <p>{errors.action}</p>
          </div>
        {/if}

        {#if success}
          <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
            <p>{success}</p>
          </div>
        {/if}

        <form on:submit|preventDefault={handleProjectSubmit} class="space-y-6">
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
              Project Title
            </label>
            <input
              type="text"
              id="title"
              bind:value={newProject.title}
              class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-ochre-500 focus:border-ochre-500"
              required
            />
          </div>

          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              bind:value={newProject.description}
              rows="4"
              class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-ochre-500 focus:border-ochre-500"
              required
            ></textarea>
          </div>

          <div>
            <label for="target_amount" class="block text-sm font-medium text-gray-700 mb-1">
              Target Amount (KES)
            </label>
            <input
              type="number"
              id="target_amount"
              bind:value={newProject.target_amount}
              class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-ochre-500 focus:border-ochre-500"
              min="1"
              required
            />
          </div>

          <div class="flex justify-end">
            <button
              type="submit"
              class="px-6 py-2 bg-ochre-600 text-white rounded-lg hover:bg-ochre-700 focus:ring-2 focus:ring-offset-2 focus:ring-ochre-500 disabled:opacity-50"
              disabled={loading.action}
            >
              {#if loading.action}
                <span class="flex items-center">
                  <span class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  Creating...
                </span>
              {:else}
                Create Project
              {/if}
            </button>
          </div>
        </form>
      </div>

      <!-- Project List -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <h2 class="text-2xl font-display font-bold text-ochre-900 mb-6">Manage Projects</h2>

        {#if loading.projects}
          <div class="flex justify-center items-center min-h-[200px]">
            <div class="animate-spin rounded-full h-16 w-16 border-4 border-ochre-500 border-t-transparent"></div>
          </div>
        {:else}
          <div class="space-y-8">
            {#each projects as project}
              <div class="border-2 border-gray-100 rounded-xl p-6">
                <div class="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <h3 class="text-xl font-semibold text-ochre-900">{project.title}</h3>
                    <p class="text-gray-600 mt-1">{project.description}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm text-gray-500">Target Amount</p>
                    <p class="text-lg font-semibold text-ochre-900">{formatAmount(project.target_amount)}</p>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div class="bg-warmth-100 rounded-lg p-4">
                    <p class="text-sm text-gray-500">Raised</p>
                    <p class="text-lg font-semibold text-ochre-700">{formatAmount(project.raised_amount)}</p>
                  </div>
                  <div class="bg-warmth-100 rounded-lg p-4">
                    <p class="text-sm text-gray-500">Donors</p>
                    <p class="text-lg font-semibold text-ochre-700">{project.donor_count || 0}</p>
                  </div>
                  <div class="bg-warmth-100 rounded-lg p-4">
                    <p class="text-sm text-gray-500">Updates</p>
                    <p class="text-lg font-semibold text-ochre-700">{project.update_count || 0}</p>
                  </div>
                </div>

                <!-- Project Actions -->
                <div class="space-y-4">
                  <button
                    class="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-left"
                    on:click={() => {
                      selectedProject = selectedProject?.id === project.id ? null : project;
                      if (selectedProject) {
                        loadProjectDonations(project.id);
                      }
                    }}
                  >
                    {selectedProject?.id === project.id ? 'Hide Details' : 'Show Details'}
                  </button>

                  {#if selectedProject?.id === project.id}
                    <div class="border-t-2 border-gray-100 pt-4 space-y-6">
                      <!-- Add Update Form -->
                      <div>
                        <h4 class="font-semibold text-ochre-900 mb-4">Add Project Update</h4>
                        <form on:submit|preventDefault={() => handleUpdateSubmit(project.id)} class="space-y-4">
                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                              Update Title
                            </label>
                            <input
                              type="text"
                              bind:value={newUpdate.title}
                              class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-ochre-500 focus:border-ochre-500"
                              required
                            />
                          </div>

                          <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                              Update Content
                            </label>
                            <textarea
                              bind:value={newUpdate.content}
                              rows="3"
                              class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-ochre-500 focus:border-ochre-500"
                              required
                            ></textarea>
                          </div>

                          <button
                            type="submit"
                            class="px-6 py-2 bg-ochre-100 text-ochre-700 rounded-lg hover:bg-ochre-200 transition disabled:opacity-50"
                            disabled={loading.action}
                          >
                            {loading.action ? 'Adding...' : 'Add Update'}
                          </button>
                        </form>
                      </div>

                      <!-- Donations List -->
                      <div>
                        <h4 class="font-semibold text-ochre-900 mb-4">Recent Donations</h4>
                        {#if loading.donations}
                          <div class="flex justify-center items-center h-32">
                            <div class="animate-spin rounded-full h-8 w-8 border-2 border-ochre-500 border-t-transparent"></div>
                          </div>
                        {:else if donations.length === 0}
                          <p class="text-gray-500 text-center py-4">No donations yet</p>
                        {:else}
                          <div class="space-y-2">
                            {#each donations as donation}
                              <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <div>
                                  <p class="font-medium text-gray-900">{formatAmount(donation.amount)}</p>
                                  <p class="text-sm text-gray-500">{donation.phone_number}</p>
                                </div>
                                <div class="text-right">
                                  <p class="text-sm text-gray-500">{formatDate(donation.created_at)}</p>
                                  <span class={`text-xs font-medium px-2 py-1 rounded-full ${
                                    donation.status === 'completed' ? 'bg-green-100 text-green-700' :
                                    donation.status === 'failed' ? 'bg-red-100 text-red-700' :
                                    'bg-yellow-100 text-yellow-700'
                                  }`}>
                                    {donation.status}
                                  </span>
                                </div>
                              </div>
                            {/each}
                          </div>
                        {/if}
                      </div>
                    </div>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>
</main>

<style>
  /* Custom styles are handled by Tailwind CSS */
</style> 