&lt;script lang="ts">
  export let label = '';
  export let checked = false;
  export let error = '';
  export let required = false;
  export let disabled = false;
  export let name = '';
  export let id = '';
  export let description = '';

  $: checkboxClasses = [
    'h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500',
    error ? 'border-red-300' : '',
    disabled ? 'opacity-50 cursor-not-allowed' : ''
  ].join(' ');
&lt;/script>

&lt;div class="relative flex items-start">
  &lt;div class="flex h-5 items-center">
    &lt;input
      type="checkbox"
      {name}
      {id}
      bind:checked
      {required}
      {disabled}
      class={checkboxClasses}
      aria-invalid={!!error}
      aria-describedby={error ? `${name}-error` : undefined}
    />
  &lt;/div>
  &lt;div class="ml-3 text-sm">
    {#if label}
      &lt;label
        for={id || name}
        class="font-medium text-gray-700"
        class:cursor-not-allowed={disabled}
      >
        {label}
        {#if required}
          &lt;span class="text-red-500">*&lt;/span>
        {/if}
      &lt;/label>
    {/if}
    {#if description}
      &lt;p class="text-gray-500">{description}&lt;/p>
    {/if}
    {#if error}
      &lt;p class="mt-1 text-sm text-red-600" id={`${name}-error`}>
        {error}
      &lt;/p>
    {/if}
  &lt;/div>
&lt;/div> 