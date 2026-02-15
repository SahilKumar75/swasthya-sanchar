/**
 * Supabase Realtime Client Wrapper
 * For real-time journey tracking updates
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create Supabase client with realtime enabled
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Realtime channel types
export type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*'

export interface RealtimePayload<T = any> {
  eventType: RealtimeEvent
  new: T
  old: T
  errors: any
}

/**
 * Subscribe to journey checkpoint updates
 */
export function subscribeToJourney(
  journeyId: string,
  callback: (payload: RealtimePayload) => void
) {
  const channel = supabase
    .channel(`journey:${journeyId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'JourneyCheckpoint',
        filter: `journeyId=eq.${journeyId}`
      },
      callback
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

/**
 * Subscribe to journey metadata updates (status, progress)
 */
export function subscribeToJourneyStatus(
  journeyId: string,
  callback: (payload: RealtimePayload) => void
) {
  const channel = supabase
    .channel(`journey-status:${journeyId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'PatientJourney',
        filter: `id=eq.${journeyId}`
      },
      callback
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

/**
 * Subscribe to department queue changes
 */
export function subscribeToDepartmentQueue(
  departmentId: string,
  callback: (payload: RealtimePayload) => void
) {
  const channel = supabase
    .channel(`department:${departmentId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'Department',
        filter: `id=eq.${departmentId}`
      },
      callback
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

/**
 * Subscribe to all journeys for a hospital (for admin dashboard)
 */
export function subscribeToHospitalJourneys(
  hospitalId: string,
  callback: (payload: RealtimePayload) => void
) {
  const channel = supabase
    .channel(`hospital:${hospitalId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'PatientJourney',
        filter: `hospitalId=eq.${hospitalId}`
      },
      callback
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

/**
 * Broadcast presence for staff location tracking (optional)
 */
export function broadcastStaffPresence(
  staffId: string,
  departmentId: string,
  metadata: Record<string, any> = {}
) {
  const channel = supabase.channel(`staff:${staffId}`)
  
  channel.subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await channel.track({
        staffId,
        departmentId,
        ...metadata,
        timestamp: new Date().toISOString()
      })
    }
  })

  return () => {
    channel.untrack()
    supabase.removeChannel(channel)
  }
}
