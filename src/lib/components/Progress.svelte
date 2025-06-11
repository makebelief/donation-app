&lt;script lang="ts">
  export let value = 0;
  export let max = 100;
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let variant: 'primary' | 'success' | 'warning' | 'error' = 'primary';
  export let showValue = false;
  export let label = '';

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const variantClasses = {
    primary: 'bg-primary-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600'
  };

  $: percentage = Math.round((value / max) * 100);
  $: progressClasses = [
    'rounded-full',
    sizeClasses[size],
    variantClasses[variant]
  ].join(' ');
&lt;/script>

&lt;div>
  {#if label}
    &lt;div class="flex justify-between items-center mb-1">
      &lt;span class="text-sm font-medium text-gray-700">{label}&lt;/span>
      {#if showValue}
        &lt;span class="text-sm font-medium text-gray-700">{percentage}%&lt;/span>
      {/if}
    &lt;/div>
  {/if}
  &lt;div class="w-full bg-gray-200 rounded-full" class:h-1={size === 'sm'} class:h-2={size === 'md'} class:h-3={size === 'lg'}>
    &lt;div
      class={progressClasses}
      style="width: {percentage}%"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin="0"
      aria-valuemax={max}
    />
  &lt;/div>
&lt;/div> 