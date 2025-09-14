import { useState } from 'react';
import { 
  BookOpen, 
  Zap, 
  Map, 
  ChevronDown, 
  ChevronRight,
  Code,
  BarChart3
} from 'lucide-react';

interface DocsSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  searchQuery: string;
}

interface SidebarSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  items?: SidebarItem[];
}

interface SidebarItem {
  id: string;
  title: string;
  description?: string;
}

export const DocsSidebar = ({ activeSection, onSectionChange, searchQuery }: DocsSidebarProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['getting-started', 'api-reference']);

  const sections: SidebarSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <BookOpen className="w-4 h-4" />,
      items: [
        { id: 'introduction', title: 'Introduction', description: 'Overview of the API' },
        { id: 'authentication', title: 'Authentication', description: 'API key setup' },
        { id: 'quick-start', title: 'Quick Start', description: 'Your first API call' },
        { id: 'rate-limits', title: 'Rate Limits', description: 'Usage limits and quotas' },
      ]
    },
    {
      id: 'api-reference',
      title: 'API Reference',
      icon: <Code className="w-4 h-4" />,
      items: [
        { id: 'provinces', title: 'Provinces', description: 'Get all provinces in Sri Lanka' },
        { id: 'districts', title: 'Districts', description: 'Get districts by province' },
        { id: 'dsds', title: 'DSDs', description: 'Divisional Secretariat Divisions' },
        { id: 'divisions', title: 'GN Divisions', description: 'Grama Niladhari Divisions' },
      ]
    },
    {
      id: 'examples',
      title: 'Code Examples',
      icon: <Zap className="w-4 h-4" />,
      items: [
        { id: 'javascript', title: 'JavaScript', description: 'Fetch API examples' },
        { id: 'python', title: 'Python', description: 'Requests library examples' },
        { id: 'curl', title: 'cURL', description: 'Command line examples' },
        { id: 'postman', title: 'Postman', description: 'Collection and environment' },
      ]
    },
    {
      id: 'guides',
      title: 'Guides & Tutorials',
      icon: <Map className="w-4 h-4" />,
      items: [
        { id: 'location-finder', title: 'Location Finder', description: 'Build a location search form' },
        { id: 'address-autocomplete', title: 'Address Autocomplete', description: 'Implement autocomplete' },
        { id: 'data-visualization', title: 'Data Visualization', description: 'Map integration examples' },
        { id: 'best-practices', title: 'Best Practices', description: 'Optimization tips' },
      ]
    },
    {
      id: 'resources',
      title: 'Resources',
      icon: <BarChart3 className="w-4 h-4" />,
      items: [
        { id: 'changelog', title: 'Changelog', description: 'API version history' },
        { id: 'status', title: 'API Status', description: 'Service status page' },
        { id: 'support', title: 'Support', description: 'Get help and support' },
        { id: 'community', title: 'Community', description: 'Join our community' },
      ]
    }
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const filteredSections = sections.map(section => ({
    ...section,
    items: section.items?.filter(item => 
      searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => 
    searchQuery === '' || 
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (section.items && section.items.length > 0)
  );

  return (
    <aside className="w-80 flex-shrink-0 pr-8">
      <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
        <nav className="space-y-2">
          {filteredSections.map((section) => (
            <div key={section.id} className="space-y-1">
              <button
                onClick={() => toggleSection(section.id)}
                className={`
                  w-full flex items-center justify-between px-3 py-2 rounded-lg
                  text-sm font-medium transition-colors
                  ${expandedSections.includes(section.id)
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-variant'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  {section.icon}
                  <span>{section.title}</span>
                </div>
                {section.items && (
                  expandedSections.includes(section.id) 
                    ? <ChevronDown className="w-4 h-4" />
                    : <ChevronRight className="w-4 h-4" />
                )}
              </button>

              {section.items && expandedSections.includes(section.id) && (
                <div className="ml-4 space-y-1">
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onSectionChange(item.id)}
                      className={`
                        w-full text-left px-3 py-2 rounded-lg transition-colors
                        ${activeSection === item.id
                          ? 'bg-primary-100 text-primary-700 border-l-2 border-primary-500 dark:bg-primary-900/30 dark:text-primary-300'
                          : 'text-text-secondary hover:text-text-primary hover:bg-surface-variant'
                        }
                      `}
                    >
                      <div className="text-sm font-medium">{item.title}</div>
                      {item.description && (
                        <div className="text-xs text-text-disabled mt-1">{item.description}</div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {searchQuery && filteredSections.length === 0 && (
          <div className="text-center py-8">
            <div className="text-text-secondary text-sm">
              No results found for "{searchQuery}"
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
