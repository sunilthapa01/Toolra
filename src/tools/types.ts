import React from 'react';

export type ToolCategory =
  | 'finance'
  | 'developer'
  | 'pdf'
  | 'text'
  | 'business';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface WorkedExample {
  title: string;
  scenario: string;
  calculation: string;
  result: string;
}

export interface FormulaVariable {
  name: string;
  description: string;
}

export interface FormulaDetail {
  equation: string;
  explanation: string;
  variables: FormulaVariable[];
}

export interface CommonMistake {
  title: string;
  mistake: string;
  correction: string;
}

export interface ToolContent {
  whatIsThis: {
    overview: string;
    whyExists: string;
    realWorldUseCases: string[];
    whoShouldUse: string[];
    benefits: string[];
  };
  howToUseSteps: string[];
  workedExamples: WorkedExample[];
  formulaDetails: FormulaDetail;
  commonMistakes: CommonMistake[];
  tips: string[];
}

export interface ToolDefinition {
  slug: string;
  title: string;
  seoTitle?: string;
  description: string;
  category: ToolCategory;
  categoryName: string;
  keywords: string[];
  faqs: FAQItem[];
  comingSoon?: boolean;
  component?: React.ComponentType<any>;
  seoContent?: React.ReactNode;
  content?: ToolContent;
}

