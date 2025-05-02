import { mount } from '@vue/test-utils'
import Text from '../Text.vue'

describe('Text Component', () => {
  // Test typography variants
  describe('Typography Variants', () => {
    it('uses correct h1 tokens', () => {
      const wrapper = mount(Text, {
        props: { variant: 'h1' },
        slots: { default: 'Heading 1' }
      })
      expect(wrapper.classes()).toContain('text-2xl')
      expect(wrapper.classes()).toContain('font-semibold')
      expect(wrapper.classes()).toContain('leading-tight')
    })

    it('uses correct h2 tokens', () => {
      const wrapper = mount(Text, {
        props: { variant: 'h2' },
        slots: { default: 'Heading 2' }
      })
      expect(wrapper.classes()).toContain('text-xl')
      expect(wrapper.classes()).toContain('font-semibold')
      expect(wrapper.classes()).toContain('leading-tight')
    })

    it('uses correct body tokens', () => {
      const wrapper = mount(Text, {
        props: { variant: 'body' },
        slots: { default: 'Body text' }
      })
      expect(wrapper.classes()).toContain('text-base')
      expect(wrapper.classes()).toContain('leading-normal')
    })

    it('uses correct caption tokens', () => {
      const wrapper = mount(Text, {
        props: { variant: 'caption' },
        slots: { default: 'Caption text' }
      })
      expect(wrapper.classes()).toContain('text-sm')
      expect(wrapper.classes()).toContain('leading-normal')
    })
  })

  // Test font weights
  describe('Font Weights', () => {
    it('uses correct normal weight token', () => {
      const wrapper = mount(Text, {
        props: { weight: 'normal' },
        slots: { default: 'Text' }
      })
      expect(wrapper.classes()).toContain('font-normal')
    })

    it('uses correct medium weight token', () => {
      const wrapper = mount(Text, {
        props: { weight: 'medium' },
        slots: { default: 'Text' }
      })
      expect(wrapper.classes()).toContain('font-medium')
    })

    it('uses correct bold weight token', () => {
      const wrapper = mount(Text, {
        props: { weight: 'bold' },
        slots: { default: 'Text' }
      })
      expect(wrapper.classes()).toContain('font-bold')
    })
  })

  // Test colors
  describe('Colors', () => {
    it('uses correct default color token', () => {
      const wrapper = mount(Text, {
        props: { color: 'default' },
        slots: { default: 'Text' }
      })
      expect(wrapper.classes()).toContain('text-content-400')
    })

    it('uses correct primary color token', () => {
      const wrapper = mount(Text, {
        props: { color: 'primary' },
        slots: { default: 'Text' }
      })
      expect(wrapper.classes()).toContain('text-primary-600')
    })

    it('uses correct error color token', () => {
      const wrapper = mount(Text, {
        props: { color: 'error' },
        slots: { default: 'Text' }
      })
      expect(wrapper.classes()).toContain('text-error-700')
    })
  })

  // Test alignment
  describe('Alignment', () => {
    it('uses correct left alignment token', () => {
      const wrapper = mount(Text, {
        props: { align: 'left' },
        slots: { default: 'Text' }
      })
      expect(wrapper.classes()).toContain('text-left')
    })

    it('uses correct center alignment token', () => {
      const wrapper = mount(Text, {
        props: { align: 'center' },
        slots: { default: 'Text' }
      })
      expect(wrapper.classes()).toContain('text-center')
    })

    it('uses correct right alignment token', () => {
      const wrapper = mount(Text, {
        props: { align: 'right' },
        slots: { default: 'Text' }
      })
      expect(wrapper.classes()).toContain('text-right')
    })
  })

  // Test truncation
  describe('Truncation', () => {
    it('applies truncation classes when enabled', () => {
      const wrapper = mount(Text, {
        props: { truncate: true },
        slots: { default: 'Text' }
      })
      expect(wrapper.classes()).toContain('truncate')
      expect(wrapper.classes()).toContain('overflow-hidden')
      expect(wrapper.classes()).toContain('overflow-ellipsis')
    })

    it('does not apply truncation classes by default', () => {
      const wrapper = mount(Text, {
        slots: { default: 'Text' }
      })
      expect(wrapper.classes()).not.toContain('truncate')
      expect(wrapper.classes()).not.toContain('overflow-hidden')
      expect(wrapper.classes()).not.toContain('overflow-ellipsis')
    })
  })

  // Test HTML element mapping
  describe('HTML Element Mapping', () => {
    it('renders as h1 for h1 variant', () => {
      const wrapper = mount(Text, {
        props: { variant: 'h1' },
        slots: { default: 'Heading 1' }
      })
      expect(wrapper.element.tagName.toLowerCase()).toBe('h1')
    })

    it('renders as p for body variant', () => {
      const wrapper = mount(Text, {
        props: { variant: 'body' },
        slots: { default: 'Body text' }
      })
      expect(wrapper.element.tagName.toLowerCase()).toBe('p')
    })

    it('renders as span for caption variant', () => {
      const wrapper = mount(Text, {
        props: { variant: 'caption' },
        slots: { default: 'Caption text' }
      })
      expect(wrapper.element.tagName.toLowerCase()).toBe('span')
    })
  })
}) 