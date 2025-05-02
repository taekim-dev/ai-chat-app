import type { Preview } from '@storybook/vue3'
import '../src/assets/styles/main.css'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
    },
  },
  decorators: [
    (story) => ({
      components: { story },
      template: '<div class="p-4"><story /></div>',
    }),
  ],
}

export default preview 