export type ItineraryIcon = 'train' | 'walk' | 'taxi' | 'food' | 'info' | 'warning'

export interface ItineraryStep {
  icon: ItineraryIcon
  title: string
  description: string
  time?: string
}

export interface JourneyPlan {
  id: string
  label: string
  badge: string
  trainNumber: string
  trainName: string
  from: { station: string; code: string; time: string; date: string }
  to: { station: string; code: string; time: string; date: string }
  class: string
  classLabel: string
  fare: number
  successChance: number
  availableSeats: number
  duration: string
  distance: string
  itinerary: ItineraryStep[]
  tips: string[]
  tags: string[]
  isTatkal: boolean
  isBestChoice: boolean
}

export interface ParsedGoal {
  from: string
  to: string
  deadline: string
  budget: number
}

export interface JourneyData {
  goal: string
  parsedGoal: ParsedGoal
  plans: JourneyPlan[]
  responseMs?: number
}
