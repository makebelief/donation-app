<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  let projects = [];
  let loading = true;
  let error = null;
  let showForm = false;
  let editingProject = null;

  // Form data
  let formData = {
    title: '',
    description: '',
    target_amount: 0,
    location: '',
    category: '',
    image: '',
    status: 'ACTIVE'
  };

  onMount(async () => {
    await loadProjects();
  });

  async function loadProjects() {
    try {
      const response = await fetch('/api/admin/projects');
      if (!response.ok) throw new Error('Failed to load projects');
      projects = await response.json();
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  async function handleSubmit() {
    try {
      const url = editingProject 
        ? `/api/admin/projects/${editingProject.id}`
        : '/api/admin/projects';
      
      const response = await fetch(url, {
        method: editingProject ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save project');
      
      await loadProjects();
      resetForm();
    } catch (err) {
      error = err.message;
    }
  }

  async function deleteProject(id: string) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete project');
      
      await loadProjects();
    } catch (err) {
      error = err.message;
    }
  }

  function editProject(project) {
    editingProject = project;
    formData = { ...project };
    showForm = true;
  }

  function resetForm() {
    formData = {
      title: '',
      description: '',
      target_amount: 0,
      location: '',
      category: '',
      image: '',
      status: 'ACTIVE'
    };
    editingProject = null;
    showForm = false;
  }
</script>

<div class="space-y-6">
  <div class="flex justify-between items-center">
    <h1 class="text-2xl font-semibold text-gray-900">Projects</h1>
    <button
      class="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors"
      on:click={() => showForm = !showForm}
    >
      {showForm ? 'Cancel' : 'Add Project'}
    </button>
  </div>

  {#if error}
    <div class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
      {error}
    </div>
  {/if}

  {#if showForm}
    <div class="bg-white shadow rounded-lg p-6" transition:fade>
      <h2 class="text-xl font-semibold mb-4">{editingProject ? 'Edit' : 'New'} Project</h2>
      <form on:submit|preventDefault={handleSubmit} class="space-y-4">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            bind:value={formData.title}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            bind:value={formData.description}
            rows="4"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            required
          ></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="target_amount" class="block text-sm font-medium text-gray-700">Target Amount</label>
            <input
              type="number"
              id="target_amount"
              bind:value={formData.target_amount}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label for="location" class="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              id="location"
              bind:value={formData.location}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
            <select
              id="category"
              bind:value={formData.category}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            >
              <option value="">Select a category</option>
              <option value="EDUCATION">Education</option>
              <option value="HEALTH">Healthcare</option>
              <option value="ENVIRONMENT">Environment</option>
              <option value="COMMUNITY">Community Development</option>
              <option value="AGRICULTURE">Agriculture</option>
              <option value="TECHNOLOGY">Technology</option>
            </select>
          </div>

          <div>
            <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
            <select
              id="status"
              bind:value={formData.status}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            >
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="PAUSED">Paused</option>
            </select>
          </div>
        </div>

        <div>
          <label for="image" class="block text-sm font-medium text-gray-700">Image URL</label>
          <input
            type="url"
            id="image"
            bind:value={formData.image}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            required
          />
        </div>

        <div class="flex justify-end space-x-3">
          <button
            type="button"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            on:click={resetForm}
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
          >
            {editingProject ? 'Update' : 'Create'} Project
          </button>
        </div>
      </form>
    </div>
  {/if}

  {#if loading}
    <div class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
    </div>
  {:else}
    <div class="bg-white shadow overflow-hidden rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each projects as project}
            <tr>
              <td class="px-6 py-4">
                <div class="flex items-center">
                  {#if project.image}
                    <img src={project.image} alt={project.title} class="h-10 w-10 rounded-full object-cover mr-3" />
                  {/if}
                  <div>
                    <div class="text-sm font-medium text-gray-900">{project.title}</div>
                    <div class="text-sm text-gray-500">{project.category}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">{project.location}</td>
              <td class="px-6 py-4 text-sm text-gray-500">KES {project.target_amount.toLocaleString()}</td>
              <td class="px-6 py-4">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  {project.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                   project.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' : 
                   'bg-yellow-100 text-yellow-800'}">
                  {project.status}
                </span>
              </td>
              <td class="px-6 py-4 text-sm font-medium space-x-3">
                <button
                  class="text-primary-600 hover:text-primary-900"
                  on:click={() => editProject(project)}
                >
                  Edit
                </button>
                <button
                  class="text-red-600 hover:text-red-900"
                  on:click={() => deleteProject(project.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          {:else}
            <tr>
              <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                No projects found
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div> 