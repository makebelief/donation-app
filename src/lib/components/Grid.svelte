&lt;script lang="ts">
  export let cols: 1 | 2 | 3 | 4 | 6 | 12 = 3;
  export let gap: 'none' | 'sm' | 'md' | 'lg' = 'md';

  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
    12: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-12'
  };

  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8'
  };

  $: classes = [
    'grid',
    colsClasses[cols],
    gapClasses[gap]
  ].join(' ');
&lt;/script>

&lt;div class={classes}>
  &lt;slot />
&lt;/div> 