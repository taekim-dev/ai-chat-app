import { mount } from '@vue/test-utils'
import Card from '../Card.vue'

describe('Card Component', () => {
  // Test base classes
  describe('Base Classes', () => {
    it('applies base overflow class', () => {
      const wrapper = mount(Card, {
        slots: { default: 'Content' }
      })
      expect(wrapper.classes()).toContain('overflow-hidden')
    })
  })

  // Test variants
  describe('Variants', () => {
    it('uses correct elevated variant tokens', () => {
      const wrapper = mount(Card, {
        props: { variant: 'elevated' },
        slots: { default: 'Content' }
      })
      expect(wrapper.classes()).toContain('bg-surface-50')
      expect(wrapper.classes()).toContain('shadow-md')
      expect(wrapper.classes()).toContain('border')
      expect(wrapper.classes()).toContain('border-surface-200')
    })

    it('uses correct outlined variant tokens', () => {
      const wrapper = mount(Card, {
        props: { variant: 'outlined' },
        slots: { default: 'Content' }
      })
      expect(wrapper.classes()).toContain('bg-surface-50')
      expect(wrapper.classes()).toContain('border')
      expect(wrapper.classes()).toContain('border-surface-300')
    })

    it('uses correct filled variant tokens', () => {
      const wrapper = mount(Card, {
        props: { variant: 'filled' },
        slots: { default: 'Content' }
      })
      expect(wrapper.classes()).toContain('bg-surface-100')
    })
  })

  // Test padding
  describe('Padding', () => {
    it('uses correct small padding token', () => {
      const wrapper = mount(Card, {
        props: { padding: 'sm' },
        slots: { default: 'Content' }
      })
      expect(wrapper.classes()).toContain('p-3')
    })

    it('uses correct medium padding token', () => {
      const wrapper = mount(Card, {
        props: { padding: 'md' },
        slots: { default: 'Content' }
      })
      expect(wrapper.classes()).toContain('p-4')
    })

    it('uses correct large padding token', () => {
      const wrapper = mount(Card, {
        props: { padding: 'lg' },
        slots: { default: 'Content' }
      })
      expect(wrapper.classes()).toContain('p-6')
    })

    it('uses no padding when specified', () => {
      const wrapper = mount(Card, {
        props: { padding: 'none' },
        slots: { default: 'Content' }
      })
      expect(wrapper.classes()).toContain('p-0')
    })
  })

  // Test border radius
  describe('Border Radius', () => {
    it('uses correct small radius token', () => {
      const wrapper = mount(Card, {
        props: { radius: 'sm' },
        slots: { default: 'Content' }
      })
      expect(wrapper.classes()).toContain('rounded-sm')
    })

    it('uses correct medium radius token', () => {
      const wrapper = mount(Card, {
        props: { radius: 'md' },
        slots: { default: 'Content' }
      })
      expect(wrapper.classes()).toContain('rounded-md')
    })

    it('uses correct large radius token', () => {
      const wrapper = mount(Card, {
        props: { radius: 'lg' },
        slots: { default: 'Content' }
      })
      expect(wrapper.classes()).toContain('rounded-lg')
    })

    it('uses no radius when specified', () => {
      const wrapper = mount(Card, {
        props: { radius: 'none' },
        slots: { default: 'Content' }
      })
      expect(wrapper.classes()).toContain('rounded-none')
    })
  })

  // Test interactive states
  describe('Interactive States', () => {
    it('applies hover effects when hoverable', () => {
      const wrapper = mount(Card, {
        props: { hoverable: true },
        slots: { default: 'Content' }
      })
      expect(wrapper.classes()).toContain('hover:shadow-lg')
      expect(wrapper.classes()).toContain('hover:-translate-y-0.5')
      expect(wrapper.classes()).toContain('transition-all')
      expect(wrapper.classes()).toContain('duration-200')
    })

    it('applies click effects when clickable', () => {
      const wrapper = mount(Card, {
        props: { clickable: true },
        slots: { default: 'Content' }
      })
      expect(wrapper.classes()).toContain('cursor-pointer')
      expect(wrapper.classes()).toContain('active:scale-[0.98]')
      expect(wrapper.classes()).toContain('transition-transform')
    })

    it('applies both hover and click effects when both are enabled', () => {
      const wrapper = mount(Card, {
        props: { hoverable: true, clickable: true },
        slots: { default: 'Content' }
      })
      expect(wrapper.classes()).toContain('hover:shadow-lg')
      expect(wrapper.classes()).toContain('hover:-translate-y-0.5')
      expect(wrapper.classes()).toContain('cursor-pointer')
      expect(wrapper.classes()).toContain('active:scale-[0.98]')
      expect(wrapper.classes()).toContain('transition-all')
      expect(wrapper.classes()).toContain('transition-transform')
    })

    it('does not apply interactive effects by default', () => {
      const wrapper = mount(Card, {
        slots: { default: 'Content' }
      })
      expect(wrapper.classes()).not.toContain('hover:shadow-lg')
      expect(wrapper.classes()).not.toContain('cursor-pointer')
    })
  })

  // Test slot content
  describe('Slot Content', () => {
    it('renders default slot content', () => {
      const wrapper = mount(Card, {
        slots: { default: 'Test Content' }
      })
      expect(wrapper.text()).toBe('Test Content')
    })

    it('renders multiple elements in slot', () => {
      const wrapper = mount(Card, {
        slots: { default: '<div>First</div><div>Second</div>' }
      })
      expect(wrapper.findAll('div').length).toBe(3) // 2 slot divs + card div
    })
  })
}) 