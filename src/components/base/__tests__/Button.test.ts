import { mount } from '@vue/test-utils'
import Button from '../Button.vue'

describe('Button Component', () => {
  // Test variants
  describe('Variants', () => {
    const variants = {
      primary: ['bg-primary-500', 'text-white', 'hover:bg-primary-600', 'focus:ring-primary-500'],
      secondary: ['bg-surface-200', 'text-content-300', 'hover:bg-surface-300', 'focus:ring-surface-400'],
      outline: ['border-2', 'border-primary-500', 'text-primary-500', 'hover:bg-primary-50', 'focus:ring-primary-500'],
      ghost: ['text-primary-500', 'hover:bg-primary-50', 'focus:ring-primary-500'],
      neutral: ['bg-neutral-200', 'text-neutral-700', 'hover:bg-neutral-300', 'focus:ring-neutral-400'],
      success: ['bg-success-500', 'text-white', 'hover:bg-success-600', 'focus:ring-success-500'],
      error: ['bg-error-500', 'text-white', 'hover:bg-error-600', 'focus:ring-error-500'],
      info: ['bg-info-500', 'text-white', 'hover:bg-info-600', 'focus:ring-info-500']
    }

    Object.entries(variants).forEach(([variant, classes]) => {
      it(`uses correct ${variant} variant tokens`, () => {
        const wrapper = mount(Button, {
          props: { variant: variant as any }
        })
        classes.forEach(className => {
          expect(wrapper.classes()).toContain(className)
        })
      })
    })
  })

  // Test size variations
  describe('Size Variations', () => {
    const sizes = {
      sm: { padding: ['px-3', 'py-1.5'], text: 'text-sm', radius: 'rounded-sm' },
      md: { padding: ['px-4', 'py-2'], text: 'text-base', radius: 'rounded-md' },
      lg: { padding: ['px-6', 'py-3'], text: 'text-lg', radius: 'rounded-lg' }
    }

    Object.entries(sizes).forEach(([size, classes]) => {
      it(`uses correct ${size} size tokens`, () => {
        const wrapper = mount(Button, {
          props: { size: size as any }
        })
        classes.padding.forEach(p => expect(wrapper.classes()).toContain(p))
        expect(wrapper.classes()).toContain(classes.text)
        expect(wrapper.classes()).toContain(classes.radius)
      })
    })
  })

  // Test states and accessibility
  describe('States and Accessibility', () => {
    it('handles disabled state correctly', () => {
      const wrapper = mount(Button, {
        props: { disabled: true }
      })
      expect(wrapper.classes()).toContain('disabled:opacity-50')
      expect(wrapper.classes()).toContain('disabled:cursor-not-allowed')
      expect(wrapper.attributes('disabled')).toBeDefined()
      expect(wrapper.attributes('aria-disabled')).toBe('true')
      
      // Test click prevention
      wrapper.trigger('click')
      expect(wrapper.emitted('click')).toBeUndefined()
    })

    it('handles loading state correctly', () => {
      const wrapper = mount(Button, {
        props: { loading: true }
      })
      expect(wrapper.find('.animate-spin').exists()).toBe(true)
      expect(wrapper.attributes('disabled')).toBeDefined()
      expect(wrapper.attributes('aria-busy')).toBe('true')
      expect(wrapper.attributes('aria-disabled')).toBe('true')
      
      // Test click prevention
      wrapper.trigger('click')
      expect(wrapper.emitted('click')).toBeUndefined()
    })

    it('has correct focus ring styles', () => {
      const wrapper = mount(Button)
      const focusClasses = ['focus:outline-none', 'focus:ring-2', 'focus:ring-offset-2']
      focusClasses.forEach(className => {
        expect(wrapper.classes()).toContain(className)
      })
    })
  })

  // Test layout options
  describe('Layout', () => {
    it('handles full width and icon options correctly', () => {
      const wrapper = mount(Button, {
        props: { 
          fullWidth: true,
          icon: '🔍'
        }
      })
      expect(wrapper.classes()).toContain('w-full')
      expect(wrapper.find('.mr-2').text()).toBe('🔍')
    })

    it('hides icon when loading', () => {
      const wrapper = mount(Button, {
        props: { 
          icon: '🔍',
          loading: true
        }
      })
      expect(wrapper.find('.mr-2').text()).not.toBe('🔍')
    })
  })

  // Test events
  describe('Events', () => {
    it('emits click event with event object when clicked', async () => {
      const wrapper = mount(Button)
      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toBeTruthy()
      expect(wrapper.emitted('click')?.[0]).toBeTruthy()
    })
  })
}) 