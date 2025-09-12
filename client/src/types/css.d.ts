/**
 * CSS Custom Properties Type Definitions
 * Provides TypeScript support for CSS custom properties used in the global stylesheet
 */

declare module 'csstype' {
  interface Properties {
    // Color Properties
    '--color-primary-50'?: string;
    '--color-primary-100'?: string;
    '--color-primary-200'?: string;
    '--color-primary-300'?: string;
    '--color-primary-400'?: string;
    '--color-primary-500'?: string;
    '--color-primary-600'?: string;
    '--color-primary-700'?: string;
    '--color-primary-800'?: string;
    '--color-primary-900'?: string;

    '--color-gray-50'?: string;
    '--color-gray-100'?: string;
    '--color-gray-200'?: string;
    '--color-gray-300'?: string;
    '--color-gray-400'?: string;
    '--color-gray-500'?: string;
    '--color-gray-600'?: string;
    '--color-gray-700'?: string;
    '--color-gray-800'?: string;
    '--color-gray-900'?: string;

    '--color-success-50'?: string;
    '--color-success-500'?: string;
    '--color-success-600'?: string;

    '--color-warning-50'?: string;
    '--color-warning-500'?: string;
    '--color-warning-600'?: string;

    '--color-error-50'?: string;
    '--color-error-500'?: string;
    '--color-error-600'?: string;

    // Semantic Colors
    '--color-background'?: string;
    '--color-surface'?: string;
    '--color-surface-variant'?: string;
    '--color-text-primary'?: string;
    '--color-text-secondary'?: string;
    '--color-text-disabled'?: string;
    '--color-border'?: string;
    '--color-border-focus'?: string;
    '--color-shadow'?: string;

    // Typography
    '--font-family-sans'?: string;
    '--font-family-mono'?: string;
    '--font-size-xs'?: string;
    '--font-size-sm'?: string;
    '--font-size-base'?: string;
    '--font-size-lg'?: string;
    '--font-size-xl'?: string;
    '--font-size-2xl'?: string;
    '--font-size-3xl'?: string;
    '--font-size-4xl'?: string;
    '--font-weight-normal'?: number;
    '--font-weight-medium'?: number;
    '--font-weight-semibold'?: number;
    '--font-weight-bold'?: number;
    '--line-height-tight'?: number;
    '--line-height-normal'?: number;
    '--line-height-relaxed'?: number;

    // Spacing
    '--spacing-0'?: string;
    '--spacing-1'?: string;
    '--spacing-2'?: string;
    '--spacing-3'?: string;
    '--spacing-4'?: string;
    '--spacing-5'?: string;
    '--spacing-6'?: string;
    '--spacing-8'?: string;
    '--spacing-10'?: string;
    '--spacing-12'?: string;
    '--spacing-16'?: string;
    '--spacing-20'?: string;

    // Border Radius
    '--radius-none'?: string;
    '--radius-sm'?: string;
    '--radius-base'?: string;
    '--radius-md'?: string;
    '--radius-lg'?: string;
    '--radius-xl'?: string;
    '--radius-2xl'?: string;
    '--radius-full'?: string;

    // Shadows
    '--shadow-sm'?: string;
    '--shadow-base'?: string;
    '--shadow-md'?: string;
    '--shadow-lg'?: string;
    '--shadow-xl'?: string;

    // Transitions
    '--transition-fast'?: string;
    '--transition-base'?: string;
    '--transition-slow'?: string;

    // Z-Index
    '--z-dropdown'?: number;
    '--z-sticky'?: number;
    '--z-fixed'?: number;
    '--z-modal-backdrop'?: number;
    '--z-modal'?: number;
    '--z-popover'?: number;
    '--z-tooltip'?: number;
    '--z-toast'?: number;

    // Component Specific
    '--toast-bg'?: string;
    '--toast-color'?: string;
    '--toast-border'?: string;

    // Layout
    '--container-max-width'?: string;
    '--sidebar-width'?: string;
    '--header-height'?: string;
  }
}

// CSS Class Name Types for better component development
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'xs' | 'sm' | 'base' | 'lg';
export type CardVariant = 'default' | 'elevated';
export type BadgeVariant = 'primary' | 'success' | 'warning' | 'error';
export type AlertVariant = 'info' | 'success' | 'warning' | 'error';
export type TextVariant = 'display-1' | 'display-2' | 'heading-1' | 'heading-2' | 'heading-3' | 'body-lg' | 'body' | 'body-sm' | 'caption';

// Utility type for CSS custom property names
export type CSSCustomProperty = keyof Properties;

// Helper type for component props that accept CSS classes
export type ClassNameProp = {
  className?: string;
};

// Theme type
export type Theme = 'light' | 'dark';

// Breakpoint types for responsive design
export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export {};
