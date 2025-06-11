&lt;script lang="ts">
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let color: 'primary' | 'white' = 'primary';

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const colorClasses = {
    primary: 'text-primary-600',
    white: 'text-white'
  };
&lt;/script>

&lt;div role="status">
  &lt;svg
    class="animate-spin {sizeClasses[size]} {colorClasses[color]}"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    &lt;circle
      class="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      stroke-width="4"
    />
    &lt;path
      class="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  &lt;/svg>
  &lt;span class="sr-only">Loading...&lt;/span>
&lt;/div> 