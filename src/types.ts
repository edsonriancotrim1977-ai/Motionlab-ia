export type PromptType = 'Vídeo' | 'Imagem' | 'UGC';
export type PromptStatus = 'Compatível' | 'Novo lançamento';
export type PromptFormat = '9:16' | '16:9' | '1:1' | 'imagem' | 'vertical' | string;
export type PromptDuration = '5s' | '8s' | '10s' | '15s' | '18s' | '24s' | '7s' | string;
export type MediaType = 'video' | 'image';
export type MediaStatus = 'available' | 'placeholder';

export interface TakePrompt {
  take: number;
  duration: string;
  title: string;
  prompt: string;
}

export interface RequiredInput {
  order: number;
  label: string;
  purpose: string;
}

export interface OptionalInput {
  label: string;
  purpose: string;
}

export interface PromptMethod {
  name: string;
  fullVideo?: string;
  partialUse?: string;
  steps?: string[];
}

export interface Category {
  id: string;
  label: string;
  icon: string;
}

export interface Prompt {
  id: string;
  title: string;
  category: string;
  description: string;
  type: PromptType;
  duration: string;
  format: PromptFormat;
  status: PromptStatus;
  testedModel?: string;
  prompt: string;
  mediaType: MediaType;
  mediaUrl?: string;
  thumbnailUrl?: string;
  mediaStatus: MediaStatus;
  cloudinaryPlayerUrl?: string;
  publicId?: string;
  additionalMediaUrls?: string[];
  tags: string[];
  usageTip?: string;
  avoidList?: string[];
  // Launch & premium fields
  isLaunch?: boolean;
  launchOrder?: number;
  access?: 'free' | 'paid';
  isFreePreview?: boolean;
  previewLabel?: string;
  takePrompts?: TakePrompt[];
  requiredInputs?: RequiredInput[];
  optionalInputs?: OptionalInput[];
  method?: PromptMethod;
  isMostUsed?: boolean;
  mostUsedOrder?: number;
}

export type AccessLevel = 'free' | 'paid';
