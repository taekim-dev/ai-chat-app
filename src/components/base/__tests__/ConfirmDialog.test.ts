import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ConfirmDialog from '../ConfirmDialog.vue'

describe('ConfirmDialog', () => {
  it('renders when modelValue is true', () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        modelValue: true,
        title: 'Test Title',
        message: 'Test Message'
      },
      global: {
        stubs: {
          Teleport: true
        }
      }
    })
    
    expect(wrapper.text()).toContain('Test Title')
    expect(wrapper.text()).toContain('Test Message')
    expect(wrapper.findAll('button')).toHaveLength(2)
  })

  it('does not render when modelValue is false', () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        modelValue: false,
        title: 'Test Title',
        message: 'Test Message'
      },
      global: {
        stubs: {
          Teleport: true
        }
      }
    })
    
    expect(wrapper.find('.fixed').exists()).toBe(false)
  })

  it('emits update:modelValue when Cancel is clicked', async () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        modelValue: true,
        title: 'Test Title',
        message: 'Test Message'
      },
      global: {
        stubs: {
          Teleport: true
        }
      }
    })
    
    const buttons = wrapper.findAll('button')
    await buttons[0].trigger('click')
    const emitted = wrapper.emitted('update:modelValue') as boolean[][]
    expect(emitted).toBeTruthy()
    expect(emitted[0]).toEqual([false])
  })

  it('emits confirm and closes when Confirm is clicked', async () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        modelValue: true,
        title: 'Test Title',
        message: 'Test Message'
      },
      global: {
        stubs: {
          Teleport: true
        }
      }
    })
    
    const buttons = wrapper.findAll('button')
    await buttons[1].trigger('click')
    const updateModelEmitted = wrapper.emitted('update:modelValue') as boolean[][]
    expect(wrapper.emitted('confirm')).toBeTruthy()
    expect(updateModelEmitted).toBeTruthy()
    expect(updateModelEmitted[0]).toEqual([false])
  })
}) 