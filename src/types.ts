export interface Car {
  id: number
  name: string
  capacity: number
}

export interface Traveler {
  id: number
  name: string
  canDrive: boolean
  isChild: boolean
}

export interface Assignment {
  car: Car
  driver: Traveler
  navigator: Traveler | null
  backSeat: Traveler[]
}
