<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  let users = [];
  let loading = true;
  let error = null;
  let success = false;
  let showForm = false;
  let editingUser = null;

  // Form data
  let formData = {
    email: '',
    name: '',
    role: 'USER',
    phone: '',
    status: 'ACTIVE'
  };

  onMount(async () => {
    await loadUsers();
  });

  async function loadUsers() {
    try {
      const response = await fetch('/api/admin/users');
      if (!response.ok) throw new Error('Failed to load users');
      users = await response.json();
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  async function handleSubmit() {
    try {
      const url = editingUser 
        ? `/api/admin/users/${editingUser.id}`
        : '/api/admin/users';
      
      const response = await fetch(url, {
        method: editingUser ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save user');
      
      await loadUsers();
      resetForm();
      success = true;
      setTimeout(() => success = false, 3000);
    } catch (err) {
      error = err.message;
    }
  }

  async function deleteUser(id: string) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete user');
      
      await loadUsers();
    } catch (err) {
      error = err.message;
    }
  }

  async function updateUserStatus(id: string, status: string) {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (!response.ok) throw new Error('Failed to update user status');
      await loadUsers();
    } catch (err) {
      error = err.message;
    }
  }

  function editUser(user) {
    editingUser = user;
    formData = { ...user };
    showForm = true;
  }

  function resetForm() {
    formData = {
      email: '',
      name: '',
      role: 'USER',
      phone: '',
      status: 'ACTIVE'
    };
    editingUser = null;
    showForm = false;
  }
</script>

<div class="space-y-6">
  <div class="flex justify-between items-center">
    <h1 class="text-2xl font-semibold text-gray-900">Users</h1>
    <button
      class="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors"
      on:click={() => showForm = !showForm}
    >
      {showForm ? 'Cancel' : 'Add User'}
    </button>
  </div>

  {#if error}
    <div class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md" transition:fade>
      {error}
    </div>
  {/if}

  {#if success}
    <div class="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md" transition:fade>
      User {editingUser ? 'updated' : 'created'} successfully!
    </div>
  {/if}

  {#if showForm}
    <div class="bg-white shadow rounded-lg p-6" transition:fade>
      <h2 class="text-xl font-semibold mb-4">{editingUser ? 'Edit' : 'New'} User</h2>
      <form on:submit|preventDefault={handleSubmit} class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              bind:value={formData.email}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              bind:value={formData.name}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              id="phone"
              bind:value={formData.phone}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
            <select
              id="role"
              bind:value={formData.role}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            >
              <option value="ADMIN">Admin</option>
              <option value="USER">User</option>
              <option value="MODERATOR">Moderator</option>
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
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
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
            {editingUser ? 'Update' : 'Create'} User
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
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each users as user}
            <tr>
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span class="text-primary-600 font-medium text-lg">
                        {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{user.name || 'No name'}</div>
                    <div class="text-sm text-gray-500">{user.email}</div>
                    {#if user.phone}
                      <div class="text-sm text-gray-500">{user.phone}</div>
                    {/if}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  {user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 
                   user.role === 'MODERATOR' ? 'bg-blue-100 text-blue-800' : 
                   'bg-gray-100 text-gray-800'}">
                  {user.role}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  {user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                   user.status === 'INACTIVE' ? 'bg-yellow-100 text-yellow-800' : 
                   'bg-red-100 text-red-800'}">
                  {user.status}
                </span>
              </td>
              <td class="px-6 py-4 text-sm font-medium space-x-3">
                <button
                  class="text-primary-600 hover:text-primary-900"
                  on:click={() => editUser(user)}
                >
                  Edit
                </button>
                {#if user.status !== 'ACTIVE'}
                  <button
                    class="text-green-600 hover:text-green-900"
                    on:click={() => updateUserStatus(user.id, 'ACTIVE')}
                  >
                    Activate
                  </button>
                {:else}
                  <button
                    class="text-yellow-600 hover:text-yellow-900"
                    on:click={() => updateUserStatus(user.id, 'INACTIVE')}
                  >
                    Deactivate
                  </button>
                {/if}
                <button
                  class="text-red-600 hover:text-red-900"
                  on:click={() => deleteUser(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          {:else}
            <tr>
              <td colspan="4" class="px-6 py-4 text-center text-gray-500">
                No users found
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div> 