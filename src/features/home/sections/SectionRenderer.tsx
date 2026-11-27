import React, { ComponentType } from 'react';
import { SectionConfig } from '../../../config/types';
import { Animated } from 'react-native';
import { CategoryChips } from './CategoryChips';
import { DoctorCarousel } from './DoctorCarousel';
import { HeroBanner } from './HeroBanner';
import { OfferStrip } from './OfferStrip';
import { QuickActions } from './QuickActions';
import { SectionShell } from './SectionShell';
import { ServiceGrid } from './ServiceGrid';
import { SectionProps } from './types';

const sectionComponents = new Map<string, ComponentType<SectionProps>>([
  ['hero_banner', HeroBanner],
  ['category_chips', CategoryChips],
  ['quick_actions', QuickActions],
  ['service_grid', ServiceGrid],
  ['doctor_carousel', DoctorCarousel],
  ['offer_strip', OfferStrip],
]);

interface Props {
  section: SectionConfig;
  scrollY: Animated.Value;
  isVisible: boolean;
}

export function SectionRenderer({ section, scrollY, isVisible }: Props) {
  const Component = sectionComponents.get(section.type);

  if (!Component) {
    return null;
  }

  if (section.type === 'hero_banner') {
    return <Component section={section} scrollY={scrollY} />;
  }

  return (
    <SectionShell
      section={section}
      play={isVisible}
      thin={section.type === 'offer_strip'}
    >
      <Component section={section} scrollY={scrollY} />
    </SectionShell>
  );
}
