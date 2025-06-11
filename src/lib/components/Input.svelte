<script lang="ts">
  export let type: 'text' | 'email' | 'password' | 'number' | 'tel' = 'text';
  export let label = '';
  export let value = '';
  export let placeholder = '';
  export let error = '';
  export let required = false;
  export let disabled = false;
  export let name = '';
  export let id = '';

  $: inputClasses = [
    'block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm',
    error ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' : '',
    disabled ? 'bg-gray-50 cursor-not-allowed' : ''
  ].join(' ');
</script>

<div>
  {#if label}
    <label
      for={id || name}
      class="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
      {#if required}
        <span class="text-red-500">*</span>
      {/if}
    </label>
  {/if}

  <input
    {type}
    {name}
    {id}
    bind:value
    {placeholder}
    {required}
    {disabled}
    class={inputClasses}
    aria-invalid={!!error}
    aria-describedby={error ? `${name}-error` : undefined}
  />

  {#if error}
    <p class="mt-2 text-sm text-red-600" id={`${name}-error`}>
      {error}
    </p>
  {/if}
</div> 