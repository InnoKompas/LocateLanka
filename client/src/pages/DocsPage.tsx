import { useState } from 'react';
import { DocsLayout } from '../components/docs/DocsLayout';
import { DocsSidebar } from '../components/docs/DocsSidebar';
import { DocsContent } from '../components/docs/DocsContent';

export const DocsPage = () => {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <DocsLayout
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <div className="flex">
        <DocsSidebar 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          searchQuery={searchQuery}
        />
        <DocsContent 
          activeSection={activeSection}
          searchQuery={searchQuery}
        />
      </div>
    </DocsLayout>
  );
};
