<template>
  <div class="message">
    <div
      class="avatar"
      :style="!entry?.message.length ? { background: '#929292' } : {}"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="icon"
      >
        <path
          fill-rule="evenodd"
          d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
    <div v-if="pending && !entry?.message.length" class="loader"></div>
    <div class="response-wrapper">
      <div class="response">
        <FormattedOutput :message="marked.parse(entry?.message)" />
      </div>
      <div
        v-if="entry && entry.sources && entry.sources.length"
        class="sources"
      >
        <p>Sources:</p>
        <ul>
          <li v-for="source in entry.sources" class="source">
            <a
              :href="getDocUrl(source.url)"
              target="_blank"
              :title="source.score"
            >
              {{ getDocName(source.url) }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useChat } from '../composables/useChat.ts';
import { marked } from 'marked';
import FormattedOutput from './FormattedOutput.vue';
import { PropType } from 'vue';

defineProps({
  entry: Object,
  pending: Boolean,
});

const { getDocUrl, getDocName } = useChat();
</script>

<style lang="scss" scoped>
@import '../styles/variables';
@import '../styles/mixins';

.message {
  @include message;
}

.avatar {
  @include avatar;
}

.icon {
  @include icon;
}

.loader {
  @include loader;
}

.response {
  @include response;
}

.sources {
  color: var(--text-color);

  p {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }
}

.source {
  display: inline-block;

  @media screen and (max-width: $desktop-breakpoint) {
    display: block;
    margin-bottom: 0.5rem;
  }

  a {
    position: relative;
    background: var(--primary-color);
    color: var(--secondary-color);
    padding: 0.25rem 0.5rem;
    text-decoration: none;
    margin: 0.5rem;
    cursor: pointer;
    border-radius: 0.25rem;
    font-size: 0.75rem;

    &:first-child {
      margin-left: 0;
    }
  }
}
</style>
