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

export interface ToolDefinition {
  slug: string;
  title: string;
  description: string;
  category: ToolCategory;
  categoryName: string;
  keywords: string[];
  faqs: FAQItem[];
  comingSoon?: boolean;
  component?: React.ComponentType<any>;
  seoContent?: React.ReactNode;
}
