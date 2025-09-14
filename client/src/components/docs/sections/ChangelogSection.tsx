import { DocsSection } from '../shared/DocsSection';

export const ChangelogSection = () => {
  return (
    <DocsSection 
      title="Changelog"
      description="API version history and updates."
    >
      <div className="bg-surface border border-border rounded-lg p-6">
        <p className="text-text-secondary">Changelog coming soon...</p>
      </div>
    </DocsSection>
  );
};
