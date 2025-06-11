&lt;script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  export let text = '';
  export let position: 'top' | 'bottom' | 'left' | 'right' = 'top';
  export let delay = 200;

  let showTooltip = false;
  let tooltipElement: HTMLDivElement;
  let triggerElement: HTMLDivElement;
  let timeoutId: number;

  const dispatch = createEventDispatcher();

  function calculatePosition() {
    if (!tooltipElement || !triggerElement) return {};

    const trigger = triggerElement.getBoundingClientRect();
    const tooltip = tooltipElement.getBoundingClientRect();

    const positions = {
      top: {
        top: trigger.top - tooltip.height - 8,
        left: trigger.left + (trigger.width - tooltip.width) / 2
      },
      bottom: {
        top: trigger.bottom + 8,
        left: trigger.left + (trigger.width - tooltip.width) / 2
      },
      left: {
        top: trigger.top + (trigger.height - tooltip.height) / 2,
        left: trigger.left - tooltip.width - 8
      },
      right: {
        top: trigger.top + (trigger.height - tooltip.height) / 2,
        left: trigger.right + 8
      }
    };

    return positions[position];
  }

  function showTooltipWithDelay() {
    timeoutId = window.setTimeout(() => {
      showTooltip = true;
      dispatch('show');
    }, delay);
  }

  function hideTooltip() {
    window.clearTimeout(timeoutId);
    showTooltip = false;
    dispatch('hide');
  }
&lt;/script>

&lt;div
  class="inline-block"
  bind:this={triggerElement}
  on:mouseenter={showTooltipWithDelay}
  on:mouseleave={hideTooltip}
  on:focus={showTooltipWithDelay}
  on:blur={hideTooltip}
>
  &lt;slot />

  {#if showTooltip}
    &lt;div
      bind:this={tooltipElement}
      class="absolute z-50 px-2 py-1 text-sm font-medium text-white bg-gray-900 rounded shadow-sm"
      style="top: {calculatePosition().top}px; left: {calculatePosition().left}px;"
      transition:fade={{ duration: 150 }}
      role="tooltip"
    >
      {text}
      &lt;div
        class="absolute w-2 h-2 bg-gray-900 transform rotate-45"
        class:top-full={position === 'top'}
        class:bottom-full={position === 'bottom'}
        class:left-full={position === 'left'}
        class:right-full={position === 'right'}
        style="left: calc(50% - 4px);"
      />
    &lt;/div>
  {/if}
&lt;/div> 