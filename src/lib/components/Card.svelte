&lt;script lang="ts">
  export let padding: 'none' | 'sm' | 'md' | 'lg' = 'md';
  export let hover = false;

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  $: classes = [
    'bg-white rounded-lg shadow',
    paddingClasses[padding],
    hover ? 'transition-shadow duration-200 hover:shadow-lg' : ''
  ].join(' ');
&lt;/script>

&lt;div class={classes}>
  &lt;slot />
&lt;/div> 