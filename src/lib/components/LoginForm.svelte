<script lang="ts">
  import { enhance } from '$app/forms';
  import Button from './Button.svelte';
  import Input from './Input.svelte';
  import Alert from './Alert.svelte';
  import { fade } from 'svelte/transition';

  export let error: string | null = null;
  let loading = false;
  let email = '';
  let password = '';

  function validateForm() {
    if (!email || !password) {
      error = 'Please fill in all fields';
      return false;
    }
    if (!email.includes('@')) {
      error = 'Please enter a valid email address';
      return false;
    }
    return true;
  }

  function handleSubmit(event: SubmitEvent) {
    if (!validateForm()) {
      event.preventDefault();
    }
    loading = true;
  }
</script>

<form
  method="POST"
  action="?/login"
  use:enhance={() => {
    return ({ result }) => {
      loading = false;
      if (result.type === 'error') {
        error = result.error?.message;
      }
    };
  }}
  on:submit={handleSubmit}
  class="w-full max-w-md space-y-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md"
>
  {#if error}
    <Alert type="error" message={error} transition={fade} />
  {/if}

  <div class="space-y-4">
    <Input
      type="email"
      label="Email"
      name="email"
      bind:value={email}
      required
      placeholder="Enter your email"
      disabled={loading}
    />

    <Input
      type="password"
      label="Password"
      name="password"
      bind:value={password}
      required
      placeholder="Enter your password"
      disabled={loading}
    />
  </div>

  <div class="flex flex-col gap-4">
    <Button type="submit" variant="primary" fullWidth loading={loading}>
      {loading ? 'Logging in...' : 'Log In'}
    </Button>
    
    <div class="text-center text-sm text-gray-600 dark:text-gray-400">
      Don't have an account?
      <a
        href="/signup"
        class="text-blue-600 dark:text-blue-400 hover:underline font-medium"
      >
        Sign up
      </a>
    </div>
  </div>
</form> 