import { Car, Traveler, Assignment } from '../types'

export const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export interface AssignmentError {
  hasError: true
  message: string
}

export interface AssignmentSuccess {
  hasError: false
  assignments: Assignment[]
}

export type AssignmentResult = AssignmentError | AssignmentSuccess

export const validateAssignment = (
  cars: Car[],
  travelers: Traveler[]
): AssignmentError | null => {
  if (cars.length === 0) {
    return { hasError: true, message: 'Please add at least one car' }
  }

  if (travelers.length === 0) {
    return { hasError: true, message: 'Please add at least one traveler' }
  }

  const drivers = travelers.filter(t => t.canDrive)

  if (drivers.length < cars.length) {
    return {
      hasError: true,
      message: `Not enough drivers! You need ${cars.length} drivers but only have ${drivers.length}`
    }
  }

  const totalCapacity = cars.reduce((sum, car) => sum + car.capacity, 0)
  if (travelers.length > totalCapacity) {
    return {
      hasError: true,
      message: `Not enough space! Total capacity is ${totalCapacity} but you have ${travelers.length} travelers`
    }
  }

  return null
}

export const assignRoles = (cars: Car[], travelers: Traveler[]): AssignmentResult => {
  const error = validateAssignment(cars, travelers)
  if (error) {
    return error
  }

  const drivers = travelers.filter(t => t.canDrive)
  const shuffledDrivers = shuffleArray(drivers)
  const nonDrivers = shuffleArray(travelers.filter(t => !t.canDrive))
  const extraDrivers = shuffledDrivers.slice(cars.length)

  // Pool of all available passengers (non-drivers + extra drivers)
  const allPassengers = [...nonDrivers, ...extraDrivers]
  const totalPassengers = allPassengers.length

  // Distribute passengers evenly using round-robin approach
  const carPassengers: Traveler[][] = cars.map(() => [])
  let passengerIndex = 0

  // Round-robin: give each car one passenger at a time until we run out
  while (passengerIndex < totalPassengers) {
    for (let i = 0; i < cars.length && passengerIndex < totalPassengers; i++) {
      const remainingSpots = cars[i].capacity - 1 - carPassengers[i].length
      if (remainingSpots > 0) {
        carPassengers[i].push(allPassengers[passengerIndex])
        passengerIndex++
      }
    }
  }

  const assignments = cars.map((car, index) => {
    const driver = shuffledDrivers[index]
    const passengers = carPassengers[index]

    // Navigator must be an adult (not a child)
    const navigatorIndex = passengers.findIndex(p => !p.isChild)
    let navigator: Traveler | null = null
    let backSeat: Traveler[] = []

    if (navigatorIndex !== -1) {
      navigator = passengers[navigatorIndex]
      backSeat = [...passengers.slice(0, navigatorIndex), ...passengers.slice(navigatorIndex + 1)]
    } else {
      // All passengers are children, so no navigator
      navigator = null
      backSeat = passengers
    }

    return {
      car,
      driver,
      navigator,
      backSeat
    }
  })

  return { hasError: false, assignments }
}
