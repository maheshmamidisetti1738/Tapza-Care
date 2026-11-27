import React from 'react';
import { EmptyState } from './EmptyState';

interface Props {
  title: string;
  onRetry: () => void;
}

export function ErrorState({ title, onRetry }: Props) {
  return (
    <EmptyState
      icon="wifi-off"
      title={title}
      message="Please check your internet connection and try again."
      actionLabel="Try again"
      onAction={onRetry}
    />
  );
}
