
export type CalcMode = 'toMurubba' | 'toPieces' | 'toPiecesFromMeter' | 'toMurubbaFromPieces';
export type InputUnit = 'metric' | 'imperial';
export type Language = 'bn' | 'en' | 'hi' | 'ar';

export interface CalculationResult {
  calcMode: CalcMode;
  inputUnit: InputUnit;
  length: number;
  width: number;
  height: number; // in cm
  quantity: number;
  totalVolumeM3: number;
  totalMurubba: number;
  totalArea: number; // m2
  piecesPerMurubba: number;
  piecesPerLinearUnit: number;
  targetValue?: number;
  totalLinearUnit?: number;
  unitPrice: number;
  totalPrice: number;
  estimatedWeightTon: number;
}

export interface HistoryItem extends CalculationResult {
  id: string;
  timestamp: number;
  label?: string;
  userMobile?: string; // Track which user saved this
}

export interface UserProfile {
  mobile: string;
  name: string;
  isLoggedIn: boolean;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
  isMine: boolean;
}
