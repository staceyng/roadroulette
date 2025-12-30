import { useState } from 'react'
import './App.css'
import CarInput from './components/CarInput'
import TravelerInput from './components/TravelerInput'
import AssignmentDisplay from './components/AssignmentDisplay'
import { Car, Traveler, Assignment } from './types'

function App() {
  const [cars, setCars] = useState<Car[]>([])
  const [travelers, setTravelers] = useState<Traveler[]>([])
  const [assignments, setAssignments] = useState<Assignment[] | null>(null)
  const [error, setError] = useState<string>('')

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const assignRoles = () => {
    setError('')

    if (cars.length === 0) {
      setError('Please add at least one car')
      return
    }

    if (travelers.length === 0) {
      setError('Please add at least one traveler')
      return
    }

    const drivers = travelers.filter(t => t.canDrive)

    if (drivers.length < cars.length) {
      setError(`Not enough drivers! You need ${cars.length} drivers but only have ${drivers.length}`)
      return
    }

    const totalCapacity = cars.reduce((sum, car) => sum + car.capacity, 0)
    if (travelers.length > totalCapacity) {
      setError(`Not enough space! Total capacity is ${totalCapacity} but you have ${travelers.length} travelers`)
      return
    }

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

    const newAssignments = cars.map((car, index) => {
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

    setAssignments(newAssignments)
  }

  const reset = () => {
    setCars([])
    setTravelers([])
    setAssignments(null)
    setError('')
  }

  return (
    <div className="app">
      <header>
        <h1>🚗 Road Roulette</h1>
      </header>

      {!assignments ? (
        <div className="input-section">
          <CarInput cars={cars} setCars={setCars} />
          <TravelerInput travelers={travelers} setTravelers={setTravelers} />

          {error && <div className="error">{error}</div>}

          <div className="action-buttons">
            <button onClick={assignRoles} className="primary-button">
              🎲 Assign Roles
            </button>
            {(cars.length > 0 || travelers.length > 0) && (
              <button onClick={reset} className="secondary-button">
                Reset All
              </button>
            )}
          </div>
        </div>
      ) : (
        <AssignmentDisplay
          assignments={assignments}
          onShuffle={assignRoles}
          onReset={reset}
        />
      )}
    </div>
  )
}

export default App
