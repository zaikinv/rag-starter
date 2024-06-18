import App from './App.vue';
import { createApp, defineCustomElement, getCurrentInstance, h } from 'vue';

const name = 'ask-docs-widget';

window.customElements.define(
  name,
  defineCustomElement({
    props: App.props,
    setup(props) {
      // @ts-ignore-next-line
      const app = createApp();

      app.mixin({
        mounted() {
          const nearestElement = (el: any) => {
            while (el?.nodeType !== 1 && el?.parentElement)
              el = el.parentElement;
            return el;
          };

          const insertStyles = (styles: string[]) => {
            if (styles?.length && this.$el) {
              this.__style = document.createElement('style');
              this.__style.innerText = styles.join().replace(/\n/g, '');
              const parent = nearestElement(this.$el);
              if (parent?.nodeType === 1) {
                parent.prepend(this.__style);
              }
            }
          };

          insertStyles(this.$?.type.styles);

          if (this.$options.components) {
            for (const comp of Object.values<any>(this.$options.components)) {
              insertStyles(comp.styles);
            }
          }
        },
        unmounted() {
          this.__style?.remove();
        },
      });

      const instance = getCurrentInstance();

      if (instance) {
        Object.assign(instance.appContext, app._context);
        Object.assign((instance as any).provides, app._context.provides);
      }

      return () => h(App, props);
    },
  }),
);
