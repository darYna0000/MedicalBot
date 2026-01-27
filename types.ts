
export interface Message {
  id: string;
  role: 'bot' | 'user';
  text: string;
  timestamp: Date;
  metadata?: {
    intent?: string;
    isDocument?: boolean;
    documentType?: string;
  };
}

export interface AnamnesisEntry {
  type: 'diagnosis' | 'diagnostic' | 'treatment' | 'consultation';
  date: string;
  description: string;
  source: string;
}

export interface PatientData {
  name?: string;
  phone?: string;
  email?: string;
  diagnosis?: string;
  isOnco?: boolean;
  history: AnamnesisEntry[];
}
