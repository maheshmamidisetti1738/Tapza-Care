import React from 'react';
import { Animated, Text } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import { SectionConfig } from '../src/config/types';
import { bundledConfig } from '../src/config/bundledConfig';
import { SectionRenderer } from '../src/features/home/sections/SectionRenderer';
import { createTheme } from '../src/theme/createTheme';
import { ThemeContext } from '../src/theme/ThemeContext';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));

const scrollY = new Animated.Value(0);

function render(section: SectionConfig) {
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <ThemeContext.Provider value={createTheme(bundledConfig.theme)}>
        <SectionRenderer section={section} scrollY={scrollY} isVisible />
      </ThemeContext.Provider>,
    );
  });
  return renderer;
}

function getTexts(renderer: ReactTestRenderer.ReactTestRenderer) {
  return renderer.root.findAllByType(Text).map(node => node.props.children);
}

describe('SectionRenderer', () => {
  it('renders nothing for an unknown section type', () => {
    const renderer = render({
      id: 'x',
      type: 'something_from_the_future',
      background: { kind: 'color', value: '#FFFFFF' },
      items: [{ anything: true }],
    });

    expect(renderer.toJSON()).toBeNull();
  });

  it('renders a service grid with its title, names and prices', () => {
    const renderer = render({
      id: 'services',
      type: 'service_grid',
      title: 'Popular services',
      columns: 2,
      background: { kind: 'color', value: '#FFFFFF' },
      items: [
        {
          id: 's1',
          name: 'General consultation',
          priceInr: 300,
          doctorId: 'd1',
          imageUrl: 'https://example.com/a.jpg',
          badge: 'Popular',
        },
      ],
    });

    const texts = getTexts(renderer);
    expect(texts).toContain('Popular services');
    expect(texts).toContain('General consultation');
    expect(texts).toContain('₹300');
    expect(texts).toContain('Popular');
  });

  it('skips broken items instead of crashing', () => {
    const renderer = render({
      id: 'services',
      type: 'service_grid',
      background: { kind: 'color', value: '#FFFFFF' },
      items: [
        null,
        'just a string',
        { id: 'no-price', name: 'Broken card' },
        {
          id: 's2',
          name: 'Child health visit',
          priceInr: 400,
          doctorId: 'd3',
          imageUrl: 'https://example.com/b.jpg',
        },
      ],
    });

    const texts = getTexts(renderer);
    expect(texts).toContain('Child health visit');
    expect(texts).not.toContain('Broken card');
  });
});
