import { API_CONFIG } from '../config';
import type { Child } from '../types';

export interface SavedData {
  children: Child[];
}

/**
 * Save children data with a specific ID
 */
export async function saveData(id: string, children: Child[]): Promise<{ success: boolean; id: string }> {
  try {
    const response = await fetch(API_CONFIG.saveUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, children })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving data:', error);
    throw error;
  }
}

/**
 * Load children data by ID
 */
export async function loadData(id: string): Promise<SavedData> {
  try {
    const response = await fetch(`${API_CONFIG.loadUrl}?id=${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Data not found');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error loading data:', error);
    throw error;
  }
}

/**
 * Generate a memorable ID on the client side
 */
export function generateReadableId(): string {
  const adjectives = [
    'happy', 'sunny', 'bright', 'calm', 'wise', 'brave', 'sweet', 'kind',
    'smart', 'cool', 'warm', 'gentle', 'proud', 'lucky', 'fresh', 'royal',
    'swift', 'bold', 'clever', 'noble', 'keen', 'free', 'pure', 'golden'
  ];

  const nouns = [
    'puppy', 'kitten', 'bunny', 'tiger', 'eagle', 'star', 'moon', 'cloud',
    'river', 'ocean', 'mountain', 'forest', 'meadow', 'garden', 'rainbow', 'sunrise',
    'fox', 'bear', 'lion', 'wolf', 'hawk', 'owl', 'dolphin', 'panda'
  ];

  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(1000 + Math.random() * 9000); // 4-digit number
  return `${adj}-${noun}-${num}`;
}
