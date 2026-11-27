import { TAB_SCREENS, TabScreen } from '../../../config/types';

export type ItemAction =
  | { type: 'doctors' }
  | { type: 'tab'; screen: TabScreen }
  | { type: 'soon' };

export interface HeroItem {
  greeting?: string;
  subtitle?: string;
}

export interface ActionItem {
  id: string;
  label: string;
  icon: string;
  action: ItemAction;
}

export interface ServiceItem {
  id: string;
  name: string;
  priceInr: number;
  icon?: string;
  imageUrl?: string;
  doctorId: string;
  badge?: string;
}

export interface DoctorCardItem {
  id: string;
  name: string;
  specialty: string;
  feeInr: number;
  photoUrl?: string;
}

export interface OfferItem {
  message: string;
  icon?: string;
}

type AnyObject = Record<string, unknown>;

function isObject(value: unknown): value is AnyObject {
  return typeof value === 'object' && value !== null;
}

function isText(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

function isItemAction(value: unknown): value is ItemAction {
  if (!isObject(value)) {
    return false;
  }
  if (value.type === 'doctors' || value.type === 'soon') {
    return true;
  }
  return (
    value.type === 'tab' &&
    (TAB_SCREENS as readonly unknown[]).includes(value.screen)
  );
}

export function isHeroItem(value: unknown): value is HeroItem {
  return isObject(value);
}

export function isActionItem(value: unknown): value is ActionItem {
  return (
    isObject(value) &&
    isText(value.id) &&
    isText(value.label) &&
    isText(value.icon) &&
    isItemAction(value.action)
  );
}

export function isServiceItem(value: unknown): value is ServiceItem {
  return (
    isObject(value) &&
    isText(value.id) &&
    isText(value.name) &&
    (isText(value.icon) || isText(value.imageUrl)) &&
    isText(value.doctorId) &&
    typeof value.priceInr === 'number'
  );
}

export function isDoctorCardItem(value: unknown): value is DoctorCardItem {
  return (
    isObject(value) &&
    isText(value.id) &&
    isText(value.name) &&
    isText(value.specialty) &&
    typeof value.feeInr === 'number'
  );
}

export function isOfferItem(value: unknown): value is OfferItem {
  return isObject(value) && isText(value.message);
}

export function pickItems<T>(
  items: unknown[],
  guard: (item: unknown) => item is T,
): T[] {
  return items.filter(guard);
}
