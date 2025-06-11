&lt;script lang="ts">
  export let size: 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'lg';
  export let padding = true;

  const sizeClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    xl: 'max-w-[96rem]',
    full: 'max-w-full'
  };

  $: classes = [
    'mx-auto w-full',
    sizeClasses[size],
    padding ? 'px-4 sm:px-6 lg:px-8' : ''
  ].join(' ');
&lt;/script>

&lt;div class={classes}>
  &lt;slot />
&lt;/div> 