import { Badge } from '../../ui/Badge';
import { CodeBlock } from './CodeBlock';

interface ApiEndpointProps {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  description: string;
  parameters?: Parameter[];
  response?: string;
  example?: string;
  exampleResponse?: string;
}

interface Parameter {
  name: string;
  type: string;
  required?: boolean;
  description: string;
  example?: string;
}

export const ApiEndpoint = ({ 
  method, 
  endpoint, 
  description, 
  parameters, 
  response,
  example,
  exampleResponse 
}: ApiEndpointProps) => {
  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'success';
      case 'POST': return 'primary';
      case 'PUT': return 'warning';
      case 'DELETE': return 'error';
      default: return 'primary';
    }
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-surface">
      {/* Header */}
      <div className="p-6 border-b border-border bg-surface-variant">
        <div className="flex items-center space-x-3 mb-3">
          <Badge variant={getMethodColor(method) as any} className="font-mono font-semibold">
            {method}
          </Badge>
          <code className="text-lg font-mono text-text-primary bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
            {endpoint}
          </code>
        </div>
        <p className="text-text-secondary">{description}</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Parameters */}
        {parameters && parameters.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-text-primary mb-4">Parameters</h4>
            <div className="space-y-3">
              {parameters.map((param, index) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <code className="font-mono text-primary-600 font-medium">{param.name}</code>
                    <Badge variant={param.required ? 'error' : 'primary'} size="sm">
                      {param.required ? 'required' : 'optional'}
                    </Badge>
                    <span className="text-sm text-text-secondary">{param.type}</span>
                  </div>
                  <p className="text-text-secondary text-sm mb-2">{param.description}</p>
                  {param.example && (
                    <div className="text-xs">
                      <span className="text-text-secondary">Example: </span>
                      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-text-primary">
                        {param.example}
                      </code>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Example Request */}
        {example && (
          <div>
            <h4 className="text-lg font-semibold text-text-primary mb-4">Example Request</h4>
            <CodeBlock code={example} language="bash" />
          </div>
        )}

        {/* Example Response */}
        {exampleResponse && (
          <div>
            <h4 className="text-lg font-semibold text-text-primary mb-4">Example Response</h4>
            <CodeBlock code={exampleResponse} language="json" />
          </div>
        )}

        {/* Response Schema */}
        {response && (
          <div>
            <h4 className="text-lg font-semibold text-text-primary mb-4">Response Schema</h4>
            <CodeBlock code={response} language="json" />
          </div>
        )}
      </div>
    </div>
  );
};
