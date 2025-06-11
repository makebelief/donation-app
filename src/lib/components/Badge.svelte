&lt;script lang="ts">
  export let variant: 'primary' | 'success' | 'warning' | 'error' | 'gray' = 'primary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let rounded = true;

  const variantClasses = {
    primary: 'bg-primary-100 text-primary-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    gray: 'bg-gray-100 text-gray-800'
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base'
  };

  $: classes = [
    'inline-flex items-center font-medium',
    variantClasses[variant],
    sizeClasses[size],
    rounded ? 'rounded-full' : 'rounded'
  ].join(' ');
&lt;/script>

&lt;span class={classes}>
  &lt;slot />
&lt;/span> 