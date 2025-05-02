import { mount } from '@vue/test-utils'
import Button from '../Button.vue'

describe('Button Component', () => {
  // Test design token usage
  describe('Design Tokens', () => {
    it('uses correct primary color tokens', () => {
      const wrapper = mount(Button, {
        props: { variant: 'primary' }
      })
      expect(wrapper.classes()).toContain('bg-primary-500')
      expect(wrapper.classes()).toContain('text-white')
      expect(wrapper.classes()).toContain('hover:bg-primary-600')
    })

    it('uses correct secondary color tokens', () => {
      const wrapper = mount(Button, {
        props: { variant: 'secondary' }
      })
      expect(wrapper.classes()).toContain('bg-surface-200')
      expect(wrapper.classes()).toContain('text-content-300')
      expect(wrapper.classes()).toContain('hover:bg-surface-300')
    })

    it('uses correct outline variant tokens', () => {
      const wrapper = mount(Button, {
        props: { variant: 'outline' }
      })
      expect(wrapper.classes()).toContain('border-2')
      expect(wrapper.classes()).toContain('border-primary-500')
      expect(wrapper.classes()).toContain('text-primary-500')
    })

    it('uses correct ghost variant tokens', () => {
      const wrapper = mount(Button, {
        props: { variant: 'ghost' }
      })
      expect(wrapper.classes()).toContain('text-primary-500')
      expect(wrapper.classes()).toContain('hover:bg-primary-50')
    })
  })

  // Test size variations
  describe('Size Variations', () => {
    it('uses correct small size tokens', () => {
      const wrapper = mount(Button, {
        props: { size: 'sm' }
      })
      expect(wrapper.classes()).toContain('px-3')
      expect(wrapper.classes()).toContain('py-1.5')
      expect(wrapper.classes()).toContain('text-sm')
      expect(wrapper.classes()).toContain('rounded-sm')
    })

    it('uses correct medium size tokens', () => {
      const wrapper = mount(Button, {
        props: { size: 'md' }
      })
      expect(wrapper.classes()).toContain('px-4')
      expect(wrapper.classes()).toContain('py-2')
      expect(wrapper.classes()).toContain('text-base')
      expect(wrapper.classes()).toContain('rounded-md')
    })

    it('uses correct large size tokens', () => {
      const wrapper = mount(Button, {
        props: { size: 'lg' }
      })
      expect(wrapper.classes()).toContain('px-6')
      expect(wrapper.classes()).toContain('py-3')
      expect(wrapper.classes()).toContain('text-lg')
      expect(wrapper.classes()).toContain('rounded-lg')
    })
  })

  // Test states
  describe('States', () => {
    it('applies correct disabled state tokens', () => {
      const wrapper = mount(Button, {
        props: { disabled: true }
      })
      expect(wrapper.classes()).toContain('disabled:opacity-50')
      expect(wrapper.classes()).toContain('disabled:cursor-not-allowed')
    })

    it('applies correct loading state tokens', () => {
      const wrapper = mount(Button, {
        props: { loading: true }
      })
      expect(wrapper.find('.animate-spin').exists()).toBe(true)
      expect(wrapper.find('svg').exists()).toBe(true)
    })
  })

  // Test full width option
  describe('Full Width', () => {
    it('applies full width class when specified', () => {
      const wrapper = mount(Button, {
        props: { fullWidth: true }
      })
      expect(wrapper.classes()).toContain('w-full')
    })

    it('does not apply full width class by default', () => {
      const wrapper = mount(Button)
      expect(wrapper.classes()).not.toContain('w-full')
    })
  })

  // Test icon support
  describe('Icon Support', () => {
    it('renders icon when provided', () => {
      const wrapper = mount(Button, {
        props: { icon: '🔍' }
      })
      expect(wrapper.find('.mr-2').text()).toBe('🔍')
    })

    it('does not render icon when not provided', () => {
      const wrapper = mount(Button)
      expect(wrapper.find('.mr-2').exists()).toBe(false)
    })
  })
}) 