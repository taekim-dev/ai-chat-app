import { mount } from '@vue/test-utils'
import Input from '../Input.vue'

describe('Input Component', () => {
  // Test design token usage
  describe('Design Tokens', () => {
    it('uses correct default state tokens', () => {
      const wrapper = mount(Input, {
        props: { modelValue: '' }
      })
      expect(wrapper.find('input').classes()).toContain('border-surface-300')
      expect(wrapper.find('input').classes()).toContain('bg-surface-50')
      expect(wrapper.find('input').classes()).toContain('rounded-md')
    })

    it('uses correct error state tokens', () => {
      const wrapper = mount(Input, {
        props: { 
          modelValue: '',
          error: 'Error message',
          label: 'Test Label'
        }
      })
      expect(wrapper.find('input').classes()).toContain('border-error-500')
      expect(wrapper.find('input').classes()).toContain('bg-error-50')
      expect(wrapper.find('label').classes()).toContain('text-error-700')
    })

    it('uses correct focus state tokens', () => {
      const wrapper = mount(Input, {
        props: { modelValue: '' }
      })
      expect(wrapper.find('input').classes()).toContain('focus:ring-primary-500/20')
      expect(wrapper.find('input').classes()).toContain('focus:border-primary-500')
    })
  })

  // Test size variations
  describe('Size Variations', () => {
    it('uses correct small size tokens', () => {
      const wrapper = mount(Input, {
        props: { 
          modelValue: '',
          size: 'sm'
        }
      })
      expect(wrapper.find('input').classes()).toContain('px-2')
      expect(wrapper.find('input').classes()).toContain('py-1')
      expect(wrapper.find('input').classes()).toContain('text-sm')
    })

    it('uses correct medium size tokens', () => {
      const wrapper = mount(Input, {
        props: { 
          modelValue: '',
          size: 'md'
        }
      })
      expect(wrapper.find('input').classes()).toContain('px-3')
      expect(wrapper.find('input').classes()).toContain('py-2')
      expect(wrapper.find('input').classes()).toContain('text-base')
    })

    it('uses correct large size tokens', () => {
      const wrapper = mount(Input, {
        props: { 
          modelValue: '',
          size: 'lg'
        }
      })
      expect(wrapper.find('input').classes()).toContain('px-4')
      expect(wrapper.find('input').classes()).toContain('py-3')
      expect(wrapper.find('input').classes()).toContain('text-lg')
    })
  })

  // Test states
  describe('States', () => {
    it('applies correct disabled state tokens', () => {
      const wrapper = mount(Input, {
        props: { 
          modelValue: '',
          disabled: true
        }
      })
      expect(wrapper.find('input').classes()).toContain('disabled:bg-surface-200')
      expect(wrapper.find('input').classes()).toContain('disabled:cursor-not-allowed')
    })

    it('applies correct required state tokens', () => {
      const wrapper = mount(Input, {
        props: { 
          modelValue: '',
          label: 'Test',
          required: true
        }
      })
      expect(wrapper.find('span').classes()).toContain('text-error-500')
    })
  })

  // Test label and placeholder
  describe('Label and Placeholder', () => {
    it('renders label with correct tokens', () => {
      const wrapper = mount(Input, {
        props: { 
          modelValue: '',
          label: 'Test Label'
        }
      })
      expect(wrapper.find('label').classes()).toContain('text-content-300')
      expect(wrapper.find('label').classes()).toContain('font-medium')
    })

    it('applies correct placeholder tokens', () => {
      const wrapper = mount(Input, {
        props: { 
          modelValue: '',
          placeholder: 'Test Placeholder'
        }
      })
      expect(wrapper.find('input').classes()).toContain('placeholder:text-content-50')
    })
  })

  // Test v-model
  describe('v-model', () => {
    it('emits update:modelValue event on input', async () => {
      const wrapper = mount(Input, {
        props: { modelValue: '' }
      })
      await wrapper.find('input').setValue('test')
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['test'])
    })
  })
}) 