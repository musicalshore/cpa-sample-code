import Enzyme, { shallow, render, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-15'
import React from 'react'

Enzyme.configure({ adapter: new Adapter() });

global.shallow = shallow
global.render = render
global.mount = mount
jest.mock('nanoid', () => jest.fn(() => 'unique_id'))