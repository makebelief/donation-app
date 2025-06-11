&lt;script lang="ts">
  export let label = '';
  export let value = '';
  export let options: { value: string; label: string }[] = [];
  export let placeholder = 'Select an option';
  export let error = '';
  export let required = false;
  export let disabled = false;
  export let name = '';
  export let id = '';

  $: selectClasses = [
    'block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm',
    error ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' : '',
    disabled ? 'bg-gray-50 cursor-not-allowed' : ''
  ].join(' ');
&lt;/script>

&lt;div>
  {#if label}
    &lt;label
      for={id || name}
      class="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
      {#if required}
        &lt;span class="text-red-500">*&lt;/span>
      {/if}
    &lt;/label>
  {/if}

  &lt;select
    {name}
    {id}
    bind:value
    {required}
    {disabled}
    class={selectClasses}
    aria-invalid={!!error}
    aria-describedby={error ? `${name}-error` : undefined}
  >
    &lt;option value="" disabled selected>{placeholder}&lt;/option>
    {#each options as option}
      &lt;option value={option.value}>{option.label}&lt;/option>
    {/each}
  &lt;/select>

  {#if error}
    &lt;p class="mt-2 text-sm text-red-600" id={`${name}-error`}>
      {error}
    &lt;/p>
  {/if}
&lt;/div> 