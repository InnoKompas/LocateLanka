import { type ReactNode } from 'react';

interface DocsSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export const DocsSection = ({ title, description, children }: DocsSectionProps) => {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-display-2 font-bold text-text-primary">{title}</h1>
        {description && (
          <p className="text-body-lg text-text-secondary max-w-3xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      
      <div className="space-y-8">
        {children}
      </div>
    </div>
  );
};
