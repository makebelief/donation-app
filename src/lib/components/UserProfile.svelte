<script lang="ts">
  import { enhance } from '$app/forms';
  import Button from './Button.svelte';
  import Input from './Input.svelte';
  import Textarea from './Textarea.svelte';
  import Alert from './Alert.svelte';
  import { fade } from 'svelte/transition';

  export let user: {
    name: string;
    email: string;
    bio?: string;
    avatar?: string;
    location?: string;
    joinedDate: Date;
  };
  export let error: string | null = null;
  export let success: string | null = null;

  let loading = false;
  let editing = false;
  let formData = { ...user };

  function handleSubmit(event: SubmitEvent) {
    loading = true;
  }

  function toggleEdit() {
    editing = !editing;
    if (!editing) {
      formData = { ...user };
    }
  }
</script>

<div class="space-y-6">
  {#if error}
    <Alert type="error" message={error} transition={fade} />
  {/if}

  {#if success}
    <Alert type="success" message={success} transition={fade} />
  {/if}

  <div class="flex items-start space-x-4">
    <div class="relative">
      <img
        src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
        alt={user.name}
        class="w-24 h-24 rounded-full object-cover"
      />
      {#if editing}
        <Button
          variant="secondary"
          size="sm"
          class="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 flex items-center justify-center"
        >
          <span class="sr-only">Change avatar</span>
          📷
        </Button>
      {/if}
    </div>

    <div class="flex-1">
      {#if editing}
        <form
          method="POST"
          action="?/updateProfile"
          use:enhance={() => {
            return ({ result }) => {
              loading = false;
              if (result.type === 'error') {
                error = result.error?.message;
              } else {
                success = 'Profile updated successfully';
                editing = false;
              }
            };
          }}
          on:submit={handleSubmit}
          class="space-y-4"
        >
          <Input
            label="Name"
            name="name"
            bind:value={formData.name}
            required
            disabled={loading}
          />

          <Input
            type="email"
            label="Email"
            name="email"
            bind:value={formData.email}
            required
            disabled={loading}
          />

          <Input
            label="Location"
            name="location"
            bind:value={formData.location}
            disabled={loading}
          />

          <Textarea
            label="Bio"
            name="bio"
            bind:value={formData.bio}
            rows={4}
            disabled={loading}
          />

          <div class="flex space-x-3">
            <Button
              type="submit"
              variant="primary"
              loading={loading}
            >
              Save Changes
            </Button>
            <Button
              type="button"
              variant="secondary"
              on:click={toggleEdit}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      {:else}
        <div class="space-y-4">
          <div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
              {user.name}
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {user.email}
            </p>
          </div>

          {#if user.location}
            <p class="text-sm text-gray-600 dark:text-gray-400 flex items-center">
              📍 {user.location}
            </p>
          {/if}

          {#if user.bio}
            <p class="text-gray-600 dark:text-gray-400">
              {user.bio}
            </p>
          {/if}

          <p class="text-sm text-gray-600 dark:text-gray-400">
            Joined {new Date(user.joinedDate).toLocaleDateString()}
          </p>

          <Button
            variant="secondary"
            on:click={toggleEdit}
          >
            Edit Profile
          </Button>
        </div>
      {/if}
    </div>
  </div>
</div> 