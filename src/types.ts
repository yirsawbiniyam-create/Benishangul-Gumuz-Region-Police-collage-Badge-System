export type BadgeStatus = "ACTIVE" | "REVOKED" | "EXPIRED";

export interface BadgeData {
  id?: string;
  badgeId: string; // e.g. "BGRP-TEC-2026-001"
  fullNameAmharic: string;
  fullNameEnglish: string;
  departmentAmharic: string;
  departmentEnglish: string;
  rankAmharic: string; // e.g. "ኮማንደር / Commander", "ኢንስፔክተር / Inspector"
  rankEnglish: string;
  phoneNumber: string;
  
  // Image Assets (Base64 data URLs or SVG strings)
  headshotPhoto: string; // Processed officer photo
  rawHeadshotPhoto?: string; // Original uploaded photo before processing
  ethiopiaFlag?: string; // Ethiopian Flag SVG/Data URL
  regionFlag?: string; // Benishangul Gumuz Flag SVG/Data URL
  commissionLogo?: string; // Police Commission Emblem SVG/Data URL
  officialStamp?: string; // Circular Police Stamp SVG/Data URL
  signature?: string; // Official Authority Signature SVG/Data URL
  
  // Status & Timestamps
  status: BadgeStatus;
  issueDate: string; // YYYY-MM-DD
  expiryDate: string; // YYYY-MM-DD
  createdAt: string; // ISO String
  updatedAt?: string; // ISO String
  notes?: string;
}

export interface PhotoEnhancementOptions {
  autoWhiteBackground: boolean;
  glareReduction: boolean;
  autoBrightnessContrast: boolean;
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
  offsetX: number; // -200 to 200 (ወደ ግራ / ወደ ቀኝ)
  offsetY: number; // -200 to 200 (ወደ ላይ / ወደ ታች)
  zoom: number; // 0.5 to 3.0 (ማጉያ)
}

export interface AdminSettings {
  username: string;
  password: string;
  loginLogo?: string;
  updatedAt?: string;
}

