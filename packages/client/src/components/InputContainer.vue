<template>
  <div class="container">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="search-icon"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      />
    </svg>

    <ComboboxInput
      aria-autocomplete="false"
      autocomplete="off"
      :disabled="pending"
      :value="modelValue"
      class="input"
      aria-placeholder="Ask me anything"
      placeholder="Ask me anything"
      @input="updateValue"
      @keyup.enter="$emit('keyup.enter', $event)"
    />

    <button
      class="new-chat-button"
      type="button"
      aria-label="New chat"
      @click="emits('reset')"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="new-chat-icon"
      >
        <path
          fill-rule="evenodd"
          d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ComboboxInput } from '@headlessui/vue';

defineProps({
  pending: Boolean,
  modelValue: String,
});
const emits = defineEmits(['update:modelValue', 'keyup.enter', 'reset']);

const updateValue = (event: Event) => {
  emits('update:modelValue', (event.target as HTMLInputElement).value);
};
</script>

<style lang="scss" scoped>
@import '../styles/variables';
@import '../styles/mixins';

.container {
  display: flex;
  align-items: center;
  position: relative;
  padding: 0.25rem 1.5rem 0.25rem 1.5rem;
  gap: 1.2rem;
  border-bottom: 1px solid #d5d5d563;
}

.input {
  box-sizing: border-box;
  padding-right: 1rem;
  border-width: 0;
  width: 100%;
  height: 3rem;
  color: var(--text-color);
  background-color: transparent;
  font-size: 0.875rem;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #929292;
  }
}

.search-icon {
  @include icon;

  width: 1.75rem;
  color: black;
}

.new-chat-icon {
  @include icon;

  width: 1.75rem;
  color: black;
}

.new-chat-button {
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  padding: 0.25rem;
  background: none;

  &:hover {
    background: buttonface;
  }
}
</style>
