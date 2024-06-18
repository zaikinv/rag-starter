<template>
  <Dialog :open="isOpen" @close="open">
    <div class="dialog">
      <DialogPanel>
        <div class="panel">
          <Combobox>
            <InputContainer
              :pending="pending"
              v-model="userMessage"
              @keyup.enter="query"
              @reset="reset"
            />
            <ul class="messages" ref="container" v-if="messages.length">
              <li
                class="message"
                v-for="(entry, index) in messages"
                :key="index"
              >
                <UserMessage
                  v-if="entry.role === 'user'"
                  :entry="entry"
                  :pending="pending"
                />
                <AssistantMessage
                  v-if="entry.role === 'assistant'"
                  :entry="entry"
                  :pending="pending"
                />
              </li>
            </ul>
            <ChatDisclamer v-if="messages.length" />
          </Combobox>
        </div>
      </DialogPanel>
    </div>
  </Dialog>
  <AssistantButton @openModal="open" />
</template>

<script lang="ts" setup>
import { Dialog, DialogPanel, Combobox } from '@headlessui/vue';

import InputContainer from './InputContainer.vue';
import ChatDisclamer from './ChatDisclamer.vue';
import AssistantButton from './AssistantButton.vue';
import { useChat } from '../composables/useChat.ts';
import UserMessage from './UserMessage.vue';
import AssistantMessage from './AssistantMessage.vue';
import { ref } from 'vue';

const props = defineProps({
  apiUrl: String,
  vectorStoreCollectionName: String,
  externalSourceBaseUrl: String,
});

const container = ref<HTMLElement>();
const isOpen = ref(false);

const scrollToBottom = () => {
  setTimeout(() => {
    if (container.value) {
      container.value.scrollTop = container.value.scrollHeight;
    }
  }, 500);
};

const { pending, userMessage, messages, query, reset } = useChat({
  apiUrl: props.apiUrl!,
  vectorStoreCollectionName: props.vectorStoreCollectionName!,
  externalSourceBaseUrl: props.externalSourceBaseUrl!,
  receiveMessageCallback: scrollToBottom,
});

const open = (value: boolean) => {
  isOpen.value = value;
};
</script>

<style lang="scss" scoped>
@import '../styles/variables';

.message {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

.dialog {
  position: fixed;
  z-index: 999999;
  overflow-y: auto;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgb(0 0 0 / 20%);
  backdrop-filter: blur(5px);
  padding: 5rem;

  @media screen and (max-width: $tablet-breakpoint) {
    padding: 0;
    height: 100%;
  }
}

.panel {
  margin: 0 auto;
  overflow: hidden;
  max-width: 70%;
  background-color: var(--background-color);
  border-radius: 0.375rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

  @media screen and (max-width: $tablet-breakpoint) {
    max-width: 100%;
  }

  @media screen and (min-width: $tablet-breakpoint) and (max-width: $desktop-breakpoint) {
    max-width: 90%;
  }
}

.messages {
  overflow-y: auto;
  padding: 0rem 1.5rem 0.25rem 1.5rem;
  list-style: none;
  max-height: 40vh;
  font-size: 0.875rem;
  scroll-padding-top: 0.5rem;
  scroll-padding-bottom: 0.5rem;
  color: var(--text-color);

  @media screen and (max-width: $tablet-breakpoint) {
    max-height: 70vh;
  }
}
</style>
