import { describe, expect, it } from 'vitest'

import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App', () => {
  it('mounts properly', () => {
    const wrapper = mount(App, {
      global: {
        stubs: {
          RouterView: {
            template: '<div>router-view</div>',
          },
        },
      },
    })
    expect(wrapper.text()).toContain('router-view')
  })
})
