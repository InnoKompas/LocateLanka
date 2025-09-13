import { useState } from 'react';
import { Eye, EyeOff, Copy } from 'lucide-react';
import { Button } from '../ui/Button';
import toast from 'react-hot-toast';

interface ApiKeyDisplayProps {
  apiKey?: string;
  keyPrefix?: string;
  showCopyButton?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ApiKeyDisplay({ 
  apiKey, 
  keyPrefix = 'lk',
  showCopyButton = true,
  className = '',
  size = 'md'
}: ApiKeyDisplayProps) {
  const [isVisible, setIsVisible] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('API key copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const formatKey = (key?: string, prefix?: string) => {
    if (!key) {
      // Show masked version when key is not available
      return `${prefix}_${'*'.repeat(32)}`;
    }
    
    if (!isVisible) {
      // Show first 8 characters + masked rest
      return `${key.substring(0, 8)}${'*'.repeat(24)}`;
    }
    
    return key;
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-2',
    lg: 'text-base px-4 py-3'
  };

  const buttonSizeClasses = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-2'
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 18
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <code className={`
        flex-1 bg-gray-100 dark:bg-gray-700 rounded font-mono 
        text-gray-900 dark:text-white break-all
        ${sizeClasses[size]}
      `}>
        {formatKey(apiKey, keyPrefix)}
      </code>
      
      {apiKey && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(!isVisible)}
          className={buttonSizeClasses[size]}
          title={isVisible ? 'Hide API key' : 'Show API key'}
        >
          {isVisible ? <EyeOff size={iconSizes[size]} /> : <Eye size={iconSizes[size]} />}
        </Button>
      )}
      
      {showCopyButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copyToClipboard(apiKey || '')}
          className={buttonSizeClasses[size]}
          disabled={!apiKey}
          title="Copy API key"
        >
          <Copy size={iconSizes[size]} />
        </Button>
      )}
    </div>
  );
}

// Compact version for inline display
export function ApiKeyBadge({ 
  apiKey, 
  keyPrefix = 'lk',
  className = '' 
}: Pick<ApiKeyDisplayProps, 'apiKey' | 'keyPrefix' | 'className'>) {
  const formatKey = (key?: string, prefix?: string) => {
    if (!key) {
      return `${prefix}_${'*'.repeat(8)}...`;
    }
    return `${key.substring(0, 8)}...`;
  };

  return (
    <span className={`
      inline-flex items-center px-2 py-1 rounded-md text-xs font-mono
      bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300
      ${className}
    `}>
      {formatKey(apiKey, keyPrefix)}
    </span>
  );
}
