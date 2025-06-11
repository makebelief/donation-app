&lt;script lang="ts">
  export let gap: 'none' | 'sm' | 'md' | 'lg' = 'md';
  export let align: 'start' | 'center' | 'end' | 'stretch' = 'stretch';
  export let dividers = false;

  const gapClasses = {
    none: 'space-y-0',
    sm: 'space-y-4',
    md: 'space-y-6',
    lg: 'space-y-8'
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  };

  $: classes = [
    'flex flex-col',
    gapClasses[gap],
    alignClasses[align],
    dividers ? 'divide-y divide-gray-200' : ''
  ].join(' ');
&lt;/script>

&lt;div class={classes}>
  &lt;slot />
&lt;/div> 