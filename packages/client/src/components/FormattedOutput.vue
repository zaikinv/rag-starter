<template>
  <div v-html="message" class="formatted-output"></div>
</template>

<script lang="ts" setup>
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs';

defineProps({
  message: String,
});
</script>

<style lang="scss">
.formatted-output {
  ol {
    padding-inline-start: 0;
    counter-reset: list-counter;
    padding-left: 0.25rem;
  }
  ol li {
    counter-increment: list-counter;
    margin: 0.25rem 0;
    position: relative;

    &::before {
      content: counter(list-counter);
      font-size: 0.75rem;
    }

    p {
      display: inline;
    }
  }

  ul {
    padding-left: 0.25rem;
  }
  ul li {
    margin: 0.25rem 0;
    position: relative;
    line-height: 1.5rem;

    &::before {
      content: '✓';
    }

    p {
      display: inline;
    }
  }

  ol li::before,
  ul li::before {
    background: var(--primary-color);
    height: 0.75rem;
    width: 0.75rem;
    display: inline-flex;
    padding: 0.125rem;
    border-radius: 50%;
    color: var(--secondary-color);
    justify-content: center;
    align-items: center;
    margin-right: 0.4rem;
  }

  a {
    text-decoration: none;
    position: relative;
    color: var(--primary-color);
    border-bottom: 1px solid var(--primary-color);
  }

  a:hover {
    background-color: var(--primary-color);
    color: var(--secondary-color);
  }
}

code {
  background: rgb(235 235 235);
  color: var(--primary-color);
  padding: 0.075rem 0.25rem;
  text-decoration: none;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-family: monospace;
}

// anonymizer tags
address,
credit_card,
email_address,
iban_code,
imei,
ip_address,
license_plate,
mac_address,
person,
phone_number,
vin {
  * {
    display: none;
  }

  display: inline-block;
  width: 100px;
  color: black;
  background: black;
  opacity: 0.3;
  position: absolute;
  height: 1.4rem;
  overflow: hidden;
}
</style>
