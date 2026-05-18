export type PostStatus = 'draft' | 'scheduled' | 'posted' | 'failed' | 'cancelled';

export const GLV_CATEGORIES = [
  'Marketing',
  'SEO',
  'Email Marketing',
  'Paid Ad Strategy',
  'Website Building',
  'Claude Code for GLV',
  'Local SEO & GBP',
  'AI Integration for SMBs',
  'Lead Gen & Cold Outreach',
] as const;

export type GlvCategory = typeof GLV_CATEGORIES[number];

export interface ScheduledPost {
  id: string;
  platform: string;
  scheduled_at: string;
  status: PostStatus;
  carousel_ref: string | null;
  caption: string | null;
  hashtags: string[];
  audio_brief: string | null;
  geotag: string | null;
  blotato_job_id: string | null;
  category: GlvCategory | null;
  first_comment: string | null;
  manychat_keyword_triggers: string[];
  manychat_dm_template_id: string | null;
  _file: string;
  _date: string;
}

export interface EditRequest {
  post_id: string;
  platform: string;
  change_description: string;
  urgency: 'now' | 'next_sync' | 'nightly_batch';
  requested_at: string;
}
