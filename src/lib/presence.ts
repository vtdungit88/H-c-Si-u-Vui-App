import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from './supabase';
import { recordVisit } from './api';

/** Random, non-personal id kept in the browser to count unique visitors / presence. */
export function getVisitorId(): string {
  try {
    let id = localStorage.getItem('hsv_visitor_id');
    if (!id || !/^[A-Za-z0-9_-]{8,64}$/.test(id)) {
      id = (crypto.randomUUID?.() ?? Math.random().toString(36).slice(2) + Date.now().toString(36)).replace(/[^A-Za-z0-9_-]/g, '');
      localStorage.setItem('hsv_visitor_id', id);
    }
    return id;
  } catch {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}

/** REAL number of people currently on the site (Supabase Realtime Presence). null = not connected yet. */
export function useOnlineCount(): number | null {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const channel = supabase.channel('hsv-online', { config: { presence: { key: getVisitorId() } } });
    channel
      .on('presence', { event: 'sync' }, () => setCount(Object.keys(channel.presenceState()).length))
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') await channel.track({ at: Date.now() });
      });
    return () => { void supabase.removeChannel(channel); };
  }, []);
  return count;
}

/** Count one visit per visitor per day (server de-duplicates). */
export function useRecordVisit() {
  useEffect(() => {
    if (isSupabaseConfigured) recordVisit(getVisitorId()).catch(() => undefined);
  }, []);
}
