export interface Project {
  id: number;
  title: string;
  description: string;
  target_amount: number;
  raised_amount: number;
  image?: string;
  duration?: string;
  category: string;
  created_at: string;
  updated_at: string;
  sdgs?: SDG[];
}

export interface SDG {
  id: number;
  name: string;
  icon: string;
}

export interface Donation {
  id: number;
  amount: number;
  date: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface Expense {
  id: number;
  amount: number;
  description: string;
  category: string;
  date: string;
  receipt_url?: string;
}

export interface ProjectUpdate {
  id: number;
  title: string;
  content: string;
  date: string;
  images?: string[];
}

export interface ImpactMetrics {
  beneficiariesReached: number;
  completedMilestones: number;
  totalMilestones: number;
}

export interface ImpactStory {
  id: number;
  quote: string;
  name: string;
  role: string;
  created_at: string;
}

export interface ProjectTimeline {
  id: number;
  title: string;
  description: string;
  date: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
}

export interface ProjectGoal {
  id: number;
  goal: string;
}

export interface Beneficiary {
  id: number;
  beneficiary_id: string;
  name: string;
  impact_description?: string;
  created_at: string;
} 