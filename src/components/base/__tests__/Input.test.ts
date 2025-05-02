import { mount } from '@vue/test-utils'
import Input from '../Input.vue'

describe('Input Component', () => {
  // Test design tokens
  describe('Design Tokens', () => {
    it('uses correct state tokens', () => {
      // Default state
      const wrapper = mount(Input, {
        props: { modelValue: '' }
      })
      expect(wrapper.find('input').classes()).toContain('border-surface-300')
      expect(wrapper.find('input').classes()).toContain('bg-surface-50')
      expect(wrapper.find('input').classes()).toContain('rounded-md')

      // Error state
      const errorWrapper = mount(Input, {
        props: { 
          modelValue: '',
          error: 'Error message',
          label: 'Test Label'
        }
      })
      expect(errorWrapper.find('input').classes()).toContain('border-error-500')
      expect(errorWrapper.find('input').classes()).toContain('bg-error-50')
      expect(errorWrapper.find('label').classes()).toContain('text-error-700')

      // Focus state
      expect(wrapper.find('input').classes()).toContain('focus:ring-primary-500/20')
      expect(wrapper.find('input').classes()).toContain('focus:border-primary-500')
    })
  })

  // Test size variations
  describe('Size Variations', () => {
    const sizes = {
      sm: { padding: ['px-2', 'py-1'], text: 'text-sm' },
      md: { padding: ['px-3', 'py-2'], text: 'text-base' },
      lg: { padding: ['px-4', 'py-3'], text: 'text-lg' }
    }

    Object.entries(sizes).forEach(([size, classes]) => {
      it(`uses correct ${size} size tokens`, () => {
        const wrapper = mount(Input, {
          props: { 
            modelValue: '',
            size: size as any
          }
        })
        classes.padding.forEach(p => expect(wrapper.find('input').classes()).toContain(p))
        expect(wrapper.find('input').classes()).toContain(classes.text)
      })
    })
  })

  // Test states and accessibility
  describe('States and Accessibility', () => {
    it('handles disabled state correctly', () => {
      const wrapper = mount(Input, {
        props: { 
          modelValue: '',
          disabled: true
        }
      })
      expect(wrapper.find('input').classes()).toContain('disabled:bg-surface-200')
      expect(wrapper.find('input').classes()).toContain('disabled:cursor-not-allowed')
      expect(wrapper.find('input').attributes('disabled')).toBeDefined()
      expect(wrapper.find('input').attributes('aria-disabled')).toBe('true')

      // Test input prevention
      wrapper.find('input').setValue('new value')
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('handles required state correctly', () => {
      const wrapper = mount(Input, {
        props: { 
          modelValue: '',
          label: 'Test',
          required: true
        }
      })
      expect(wrapper.find('span').classes()).toContain('text-error-500')
      expect(wrapper.find('input').attributes('required')).toBeDefined()
      expect(wrapper.find('input').attributes('aria-required')).toBe('true')
    })

    it('handles error state correctly', () => {
      const wrapper = mount(Input, {
        props: { 
          modelValue: '',
          error: 'Error message',
          label: 'Test Label'
        }
      })
      expect(wrapper.find('input').attributes('aria-invalid')).toBe('true')
      expect(wrapper.find('input').attributes('aria-describedby')).toBe('Test Label-error')
      expect(wrapper.find('p').attributes('id')).toBe('Test Label-error')
      expect(wrapper.find('p').text()).toBe('Error message')
    })
  })

  // Test input types and attributes
  describe('Input Types and Attributes', () => {
    const types = ['text', 'password', 'email', 'number'] as const

    types.forEach(type => {
      it(`renders ${type} input correctly`, () => {
        const wrapper = mount(Input, {
          props: { 
            modelValue: '',
            type
          }
        })
        expect(wrapper.find('input').attributes('type')).toBe(type)
      })
    })

    it('handles label and placeholder correctly', () => {
      const wrapper = mount(Input, {
        props: { 
          modelValue: '',
          label: 'Test Label',
          placeholder: 'Test Placeholder'
        }
      })
      expect(wrapper.find('label').classes()).toContain('text-content-300')
      expect(wrapper.find('label').classes()).toContain('font-medium')
      expect(wrapper.find('label').attributes('for')).toBe('Test Label')
      expect(wrapper.find('input').attributes('placeholder')).toBe('Test Placeholder')
      expect(wrapper.find('input').classes()).toContain('placeholder:text-content-50')
    })
  })

  // Test v-model and layout
  describe('Model and Layout', () => {
    it('handles v-model correctly', async () => {
      const wrapper = mount(Input, {
        props: { modelValue: '' }
      })
      await wrapper.find('input').setValue('test')
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['test'])
    })

    it('handles full width correctly', () => {
      // Full width enabled
      const fullWidthWrapper = mount(Input, {
        props: { 
          modelValue: '',
          fullWidth: true
        }
      })
      expect(fullWidthWrapper.find('div').classes()).toContain('w-full')
      expect(fullWidthWrapper.find('input').classes()).toContain('w-full')

      // Full width disabled (default)
      const defaultWrapper = mount(Input, {
        props: { modelValue: '' }
      })
      expect(defaultWrapper.find('div').classes()).toContain('w-auto')
      expect(defaultWrapper.find('input').classes()).toContain('w-auto')
    })
  })
}) 