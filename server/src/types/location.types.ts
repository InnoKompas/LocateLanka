import { ObjectId } from 'mongodb';

// Base GeoJSON types
export interface GeoJSONGeometry {
  type: 'MultiPolygon' | 'Polygon';
  coordinates: number[][][] | number[][][][];
}

// Main GN Division document structure (matches your MongoDB collection)
export interface GNDivisionDocument {
  _id: ObjectId;
  type: 'Feature';
  properties: {
    OBJECTID_1: number;
    OBJECTID: number;
    GND_N: string;           // GN Division Name (English)
    CM_Index: string | null;
    GND_NO: string;          // GN Division Number
    GND_C: string;           // GN Division Code
    PROVINCE_N: string;      // Province Name
    PROVINCE_C: string;      // Province Code
    DISTRICT_N: string;      // District Name
    DISTRICT_C: string;      // District Code
    DSD_N: string;           // Divisional Secretariat Division Name
    DSD_C: string;           // DSD Code
    MC_UC_PC_N: string | null; // Municipal Council/Urban Council/Pradeshiya Sabha Name
    GN_Officer: string;      // Grama Niladhari Officer Name
    GN_Offic_1: number;      // GN Officer Phone
    ADMIN_CODE: number;      // Administrative Code
    Dispute: string | null;
    GND_NO_Cen: string;      // GN Division Number (Census)
    GND_NAME_C: string;      // GN Division Name (Census)
    GND_NO_Gaz: string;      // GN Division Number (Gazette)
    GND_NAME_G: string;      // GN Division Name (Sinhala/Tamil)
    YEAR_CREAT: string;      // Year Created
    DATA_SOURC: string;      // Data Source
    MTD_CREATI: string;      // Method of Creation
    Shape_Leng: number;      // Shape Length
    Shape_Area: number;      // Shape Area
    Refarance: string | null;
    Ext_SqKm: number;        // Extent in Square Kilometers
    New_Admin_: number;
    New_GND_Co: string | null;
    New_DSD_Co: string | null;
    MTD_REVISI: string | null;
    YEAR_REVIS: string | null;
    Pop_2020: number;        // Population 2020
  };
  geometry: GeoJSONGeometry;
}

// Simplified API response interfaces
export interface Province {
  id: string;
  name: string;
  nameEn: string;
  code: string;
  districtCount?: number;
  divisionCount?: number;
}

export interface District {
  id: string;
  name: string;
  nameEn: string;
  code: string;
  provinceId: string;
  provinceName: string;
  dsdCount?: number;
  divisionCount?: number;
}

export interface DSD {
  id: string;
  name: string;
  nameEn: string;
  code: string;
  districtId: string;
  districtName: string;
  provinceId: string;
  provinceName: string;
  divisionCount?: number;
}

export interface Division {
  id: string;
  name: string;
  nameEn: string;
  nameSi?: string;
  nameTa?: string;
  gnNumber: string;
  gnCode: string;
  adminCode: number;
  
  // Hierarchy
  dsdId: string;
  dsdName: string;
  districtId: string;
  districtName: string;
  provinceId: string;
  provinceName: string;
  
  // Administrative details
  gnOfficer?: string;
  gnOfficerPhone?: number;
  mcUcPcName?: string | null;
  
  // Geographic data
  area: number;           // in sq km
  population?: number;    // 2020 population
  yearCreated?: string;
  
  // Optional geometry (for detailed responses)
  geometry?: GeoJSONGeometry;
  
  // Metadata
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LocationHierarchy {
  province: Province;
  district: District;
  dsd: DSD;
  division: Division;
}

export interface SearchResult<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

// Query filters
export interface DivisionFilters {
  province?: string;
  district?: string;
  dsd?: string;
  gnOfficer?: string;
  minPopulation?: number;
  maxPopulation?: number;
  minArea?: number;
  maxArea?: number;
  yearCreated?: string;
  includeGeometry?: boolean;
  limit?: number;
  offset?: number;
}