import { API_CONFIG, SHARE_URL_BASE } from '../config';
import type { Child } from '../types';

export interface SaveResponse {
  success: boolean;
  shareId: string;
  shareUrl: string;
}

export interface LoadResponse {
  children: Child[];
  createdAt: string;
  lastModified: string;
}

/**
 * Share children data and get a shareable link
 */
export async function shareChildren(children: Child[]): Promise<SaveResponse> {
  const response = await fetch(API_CONFIG.saveUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ children }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to save' }));
    throw new Error(error.error || 'Failed to save children data');
  }

  return response.json();
}

/**
 * Load shared children data from a share ID
 */
export async function loadSharedChildren(shareId: string): Promise<LoadResponse> {
  const response = await fetch(`${API_CONFIG.loadUrl}?id=${encodeURIComponent(shareId)}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Share link not found or expired');
    }
    const error = await response.json().catch(() => ({ error: 'Failed to load' }));
    throw new Error(error.error || 'Failed to load children data');
  }

  return response.json();
}

/**
 * Get share ID from URL query parameter
 */
export function getShareIdFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('share');
}

/**
 * Generate shareable URL for a share ID
 */
export function getShareUrl(shareId: string): string {
  return `${SHARE_URL_BASE}?share=${encodeURIComponent(shareId)}`;
}
