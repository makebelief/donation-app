&lt;script lang="ts">
  export let striped = false;
  export let hoverable = true;
  export let compact = false;
  export let bordered = false;

  $: tableClasses = [
    'min-w-full divide-y divide-gray-300',
    bordered ? 'border border-gray-300' : ''
  ].join(' ');

  $: headerClasses = [
    'bg-gray-50',
    bordered ? 'border-b border-gray-300' : ''
  ].join(' ');

  $: bodyClasses = [
    'divide-y divide-gray-200 bg-white',
    striped ? 'divide-y-0' : ''
  ].join(' ');

  $: rowClasses = [
    striped ? 'even:bg-gray-50' : '',
    hoverable ? 'hover:bg-gray-50' : '',
    compact ? 'h-10' : 'h-12'
  ].join(' ');

  $: cellClasses = [
    'whitespace-nowrap',
    compact ? 'px-3 py-2' : 'px-4 py-3',
    bordered ? 'border-r border-gray-300 last:border-r-0' : ''
  ].join(' ');
&lt;/script>

&lt;div class="overflow-x-auto">
  &lt;table class={tableClasses}>
    &lt;thead class={headerClasses}>
      &lt;tr>
        &lt;slot name="header" />
      &lt;/tr>
    &lt;/thead>
    &lt;tbody class={bodyClasses}>
      &lt;slot {rowClasses} {cellClasses} />
    &lt;/tbody>
  &lt;/table>
&lt;/div> 