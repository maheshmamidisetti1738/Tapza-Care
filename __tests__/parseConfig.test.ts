import festivalDayConfig from '../src/api/mock/festivalDay.config.json';
import normalDayConfig from '../src/api/mock/normalDay.config.json';
import { ConfigError, parseConfig } from '../src/config/parseConfig';

const validConfig = () => JSON.parse(JSON.stringify(normalDayConfig));

describe('parseConfig', () => {
  it('accepts both shipped configs', () => {
    expect(parseConfig(normalDayConfig).sections.length).toBeGreaterThan(0);

    const festival = parseConfig(festivalDayConfig);
    expect(festival.theme.festival?.name).toBe('Diwali');
  });

  it('rejects a config without a usable theme', () => {
    const missingTheme = validConfig();
    delete missingTheme.theme;
    expect(() => parseConfig(missingTheme)).toThrow(ConfigError);

    const badColor = validConfig();
    badColor.theme.primary = 'teal';
    expect(() => parseConfig(badColor)).toThrow(ConfigError);
  });

  it('rejects things that are not a config at all', () => {
    expect(() => parseConfig(null)).toThrow(ConfigError);
    expect(() => parseConfig('hello')).toThrow(ConfigError);
    expect(() => parseConfig({ version: 1 })).toThrow(ConfigError);
  });

  it('rejects a config with no valid tabs', () => {
    const config = validConfig();
    config.tabs = [
      { id: 'x', label: 'X', icon: '?', screen: 'unknown_screen' },
    ];
    expect(() => parseConfig(config)).toThrow(ConfigError);
  });

  it('keeps sections with an unknown type so the renderer can skip them', () => {
    const config = validConfig();
    const types = parseConfig(config).sections.map(section => section.type);
    expect(types).toContain('video_stories');
  });

  it('drops sections without an id or type', () => {
    const config = validConfig();
    const before = config.sections.length;
    config.sections.push(
      { type: 'offer_strip' },
      { id: 'no-type' },
      'junk',
      null,
    );

    expect(parseConfig(config).sections).toHaveLength(before);
  });

  it('falls back to a plain background when the section background is broken', () => {
    const config = validConfig();
    config.sections[0].background = { kind: 'gradient', value: 'not-a-colour' };
    config.sections[1].background = undefined;

    const [first, second] = parseConfig(config).sections;
    expect(first.background).toEqual({
      kind: 'color',
      value: config.theme.background,
    });
    expect(second.background.kind).toBe('color');
  });

  it('ignores a broken festival block instead of failing', () => {
    const config = parseConfig(festivalDayConfig);
    expect(config.theme.festival).toBeDefined();

    const broken = JSON.parse(JSON.stringify(festivalDayConfig));
    broken.theme.festival = { name: 'Diwali' };
    expect(parseConfig(broken).theme.festival).toBeUndefined();
  });
});
