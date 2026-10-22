export type PromptType = 'Vídeo' | 'Imagem' | 'UGC';
export type PromptStatus = 'Testado' | 'A testar';
export type PromptFormat = '9:16' | '16:9' | '1:1';
export type PromptDuration = '5s' | '8s' | '10s';
export type MediaType = 'video' | 'image';
export type MediaStatus = 'available' | 'placeholder';

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
}
