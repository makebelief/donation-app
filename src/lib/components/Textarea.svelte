&lt;script lang="ts">
  export let label = '';
  export let value = '';
  export let placeholder = '';
  export let error = '';
  export let required = false;
  export let disabled = false;
  export let name = '';
  export let id = '';
  export let rows = 4;
  export let maxLength: number | undefined = undefined;

  $: textareaClasses = [
    'block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm',
    error ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' : '',
    disabled ? 'bg-gray-50 cursor-not-allowed' : ''
  ].join(' ');

  $: remainingChars = maxLength ? maxLength - value.length : null;
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

  &lt;div class="relative">
    &lt;textarea
      {name}
      {id}
      bind:value
      {placeholder}
      {required}
      {disabled}
      {rows}
      {maxLength}
      class={textareaClasses}
      aria-invalid={!!error}
      aria-describedby={error ? `${name}-error` : undefined}
    />

    {#if maxLength}
      &lt;div class="absolute bottom-2 right-2 text-xs text-gray-500">
        {remainingChars} characters remaining
      &lt;/div>
    {/if}
  &lt;/div>

  {#if error}
    &lt;p class="mt-2 text-sm text-red-600" id={`${name}-error`}>
      {error}
    &lt;/p>
  {/if}
&lt;/div> 