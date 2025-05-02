import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ConfirmDialog from '../ConfirmDialog.vue'

const mountDialog = (props = {}) => {
  return mount(ConfirmDialog, {
    props: {
      modelValue: true,
      title: 'Test Title',
      message: 'Test Message',
      ...props
    },
    global: {
      stubs: {
        Teleport: true,
        Button: {
          template: '<button :class="variant"><slot /></button>',
          props: ['variant']
        }
      }
    }
  })
}

describe('ConfirmDialog', () => {
  it('renders when modelValue is true', () => {
    const wrapper = mountDialog()
    
    expect(wrapper.text()).toContain('Test Title')
    expect(wrapper.text()).toContain('Test Message')
    expect(wrapper.text()).toContain('Cancel')
    expect(wrapper.text()).toContain('Confirm')
  })

  it('does not render when modelValue is false', () => {
    const wrapper = mountDialog({ modelValue: false })
    expect(wrapper.find('.fixed').exists()).toBe(false)
  })

  it('emits update:modelValue when Cancel is clicked', async () => {
    const wrapper = mountDialog()
    
    const cancelButton = wrapper.findAll('button').find(btn => btn.text() === 'Cancel')
    expect(cancelButton).toBeTruthy()
    await cancelButton?.trigger('click')
    
    const emitted = wrapper.emitted('update:modelValue') as boolean[][]
    expect(emitted).toBeTruthy()
    expect(emitted[0]).toEqual([false])
  })

  it('emits confirm and closes when Confirm is clicked', async () => {
    const wrapper = mountDialog()
    
    const confirmButton = wrapper.findAll('button').find(btn => btn.text() === 'Confirm')
    expect(confirmButton).toBeTruthy()
    await confirmButton?.trigger('click')
    
    expect(wrapper.emitted('confirm')).toBeTruthy()
    const updateModelEmitted = wrapper.emitted('update:modelValue') as boolean[][]
    expect(updateModelEmitted).toBeTruthy()
    expect(updateModelEmitted[0]).toEqual([false])
  })

  it('renders buttons with correct variants', () => {
    const wrapper = mountDialog()
    
    const buttons = wrapper.findAll('button')
    const cancelButton = buttons.find(btn => btn.text() === 'Cancel')
    const confirmButton = buttons.find(btn => btn.text() === 'Confirm')
    
    expect(cancelButton?.classes()).toContain('neutral')
    expect(confirmButton?.classes()).toContain('error')
  })
}) 