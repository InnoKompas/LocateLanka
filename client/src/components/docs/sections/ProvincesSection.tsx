import { DocsSection } from '../shared/DocsSection';
import { ApiEndpoint } from '../shared/ApiEndpoint';

export const ProvincesSection = () => {
  const getAllProvincesExample = `curl -X GET "https://api.lankalocate.lk/v1/provinces" \\
  -H "Authorization: Bearer YOUR_API_KEY"`;

  const getAllProvincesResponse = `{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Western Province",
      "sinhala": "බස්නාහිර පළාත",
      "tamil": "மேல் மாகாணம்",
      "code": "WP",
      "capital": "Colombo",
      "area": 3684,
      "population": 5837294,
      "districts": ["Colombo", "Gampaha", "Kalutara"],
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Central Province",
      "sinhala": "මධ්‍යම පළාත",
      "tamil": "மத்திய மாகாணம்",
      "code": "CP",
      "capital": "Kandy",
      "area": 5674,
      "population": 2571557,
      "districts": ["Kandy", "Matale", "Nuwara Eliya"],
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 9,
    "page": 1,
    "limit": 10,
    "hasNext": false,
    "hasPrev": false
  }
}`;

  const getProvinceByIdExample = `curl -X GET "https://api.lankalocate.lk/v1/provinces/1" \\
  -H "Authorization: Bearer YOUR_API_KEY"`;

  const getProvinceByIdResponse = `{
  "success": true,
  "data": {
    "id": 1,
    "name": "Western Province",
    "sinhala": "බස්නාහිර පළාත",
    "tamil": "மேல் மாகாணம்",
    "code": "WP",
    "capital": "Colombo",
    "area": 3684,
    "population": 5837294,
    "districts": [
      {
        "id": 1,
        "name": "Colombo",
        "sinhala": "කොළඹ",
        "tamil": "கொழும்பு",
        "code": "CO"
      },
      {
        "id": 2,
        "name": "Gampaha",
        "sinhala": "ගම්පහ",
        "tamil": "கம்பஹா",
        "code": "GA"
      },
      {
        "id": 3,
        "name": "Kalutara",
        "sinhala": "කළුතර",
        "tamil": "களுத்துறை",
        "code": "KA"
      }
    ],
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}`;

  const getDistrictsByProvinceExample = `curl -X GET "https://api.lankalocate.lk/v1/provinces/1/districts" \\
  -H "Authorization: Bearer YOUR_API_KEY"`;

  const getDistrictsByProvinceResponse = `{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Colombo",
      "sinhala": "කොළඹ",
      "tamil": "கொழும்பு",
      "code": "CO",
      "province": "Western Province",
      "provinceId": 1,
      "area": 699,
      "population": 2324349,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 3,
    "page": 1,
    "limit": 10,
    "hasNext": false,
    "hasPrev": false
  }
}`;

  return (
    <DocsSection 
      title="Provinces API"
      description="Access information about all 9 provinces in Sri Lanka, including their districts, population, and administrative details."
    >
      <div className="space-y-8">
        {/* Get All Provinces */}
        <ApiEndpoint
          method="GET"
          endpoint="/v1/provinces"
          description="Retrieve a list of all provinces in Sri Lanka with basic information."
          example={getAllProvincesExample}
          exampleResponse={getAllProvincesResponse}
        />

        {/* Get Province by ID */}
        <ApiEndpoint
          method="GET"
          endpoint="/v1/provinces/{id}"
          description="Get detailed information about a specific province, including its districts."
          parameters={[
            {
              name: "id",
              type: "integer",
              required: true,
              description: "The unique identifier of the province",
              example: "1"
            }
          ]}
          example={getProvinceByIdExample}
          exampleResponse={getProvinceByIdResponse}
        />

        {/* Get Districts by Province */}
        <ApiEndpoint
          method="GET"
          endpoint="/v1/provinces/{id}/districts"
          description="Get all districts within a specific province."
          parameters={[
            {
              name: "id",
              type: "integer",
              required: true,
              description: "The unique identifier of the province",
              example: "1"
            }
          ]}
          example={getDistrictsByProvinceExample}
          exampleResponse={getDistrictsByProvinceResponse}
        />

        {/* Province Data Structure */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Province Object Structure</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 font-medium text-text-primary">Field</th>
                  <th className="text-left py-2 px-3 font-medium text-text-primary">Type</th>
                  <th className="text-left py-2 px-3 font-medium text-text-primary">Description</th>
                </tr>
              </thead>
              <tbody className="text-text-secondary">
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">id</td>
                  <td className="py-2 px-3">integer</td>
                  <td className="py-2 px-3">Unique identifier for the province</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">name</td>
                  <td className="py-2 px-3">string</td>
                  <td className="py-2 px-3">Province name in English</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">sinhala</td>
                  <td className="py-2 px-3">string</td>
                  <td className="py-2 px-3">Province name in Sinhala</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">tamil</td>
                  <td className="py-2 px-3">string</td>
                  <td className="py-2 px-3">Province name in Tamil</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">code</td>
                  <td className="py-2 px-3">string</td>
                  <td className="py-2 px-3">Two-letter province code</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">capital</td>
                  <td className="py-2 px-3">string</td>
                  <td className="py-2 px-3">Provincial capital city</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">area</td>
                  <td className="py-2 px-3">number</td>
                  <td className="py-2 px-3">Area in square kilometers</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">population</td>
                  <td className="py-2 px-3">number</td>
                  <td className="py-2 px-3">Population count (latest census)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 font-mono">districts</td>
                  <td className="py-2 px-3">array</td>
                  <td className="py-2 px-3">List of districts in the province</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DocsSection>
  );
};
