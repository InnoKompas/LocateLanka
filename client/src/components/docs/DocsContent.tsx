import { IntroductionSection } from './sections/IntroductionSection';
import { AuthenticationSection } from './sections/AuthenticationSection';
import { QuickStartSection } from './sections/QuickStartSection';
import { RateLimitsSection } from './sections/RateLimitsSection';
import { ProvincesSection } from './sections/ProvincesSection';
import { DistrictsSection } from './sections/DistrictsSection';
import { DSDsSection } from './sections/DSDsSection';
import { DivisionsSection } from './sections/DivisionsSection';
import { JavaScriptExamplesSection } from './sections/JavaScriptExamplesSection';
import { PythonExamplesSection } from './sections/PythonExamplesSection';
import { CurlExamplesSection } from './sections/CurlExamplesSection';
import { PostmanSection } from './sections/PostmanSection';
import { LocationFinderGuide } from './sections/LocationFinderGuide';
import { AddressAutocompleteGuide } from './sections/AddressAutocompleteGuide';
import { DataVisualizationGuide } from './sections/DataVisualizationGuide';
import { BestPracticesSection } from './sections/BestPracticesSection';
import { ChangelogSection } from './sections/ChangelogSection';
import { StatusSection } from './sections/StatusSection';
import { SupportSection } from './sections/SupportSection';
import { CommunitySection } from './sections/CommunitySection';

interface DocsContentProps {
  activeSection: string;
  searchQuery: string;
}

export const DocsContent = ({ activeSection }: DocsContentProps) => {
  const renderSection = () => {
    switch (activeSection) {
      case 'introduction':
        return <IntroductionSection />;
      case 'authentication':
        return <AuthenticationSection />;
      case 'quick-start':
        return <QuickStartSection />;
      case 'rate-limits':
        return <RateLimitsSection />;
      case 'provinces':
        return <ProvincesSection />;
      case 'districts':
        return <DistrictsSection />;
      case 'dsds':
        return <DSDsSection />;
      case 'divisions':
        return <DivisionsSection />;
      case 'javascript':
        return <JavaScriptExamplesSection />;
      case 'python':
        return <PythonExamplesSection />;
      case 'curl':
        return <CurlExamplesSection />;
      case 'postman':
        return <PostmanSection />;
      case 'location-finder':
        return <LocationFinderGuide />;
      case 'address-autocomplete':
        return <AddressAutocompleteGuide />;
      case 'data-visualization':
        return <DataVisualizationGuide />;
      case 'best-practices':
        return <BestPracticesSection />;
      case 'changelog':
        return <ChangelogSection />;
      case 'status':
        return <StatusSection />;
      case 'support':
        return <SupportSection />;
      case 'community':
        return <CommunitySection />;
      default:
        return <IntroductionSection />;
    }
  };

  return (
    <div className="flex-1 min-w-0">
      <div className="w-full px-8 py-4">
        {renderSection()}
      </div>
    </div>
  );
};
