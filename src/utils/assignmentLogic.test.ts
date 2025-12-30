import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { assignRoles, validateAssignment, shuffleArray } from './assignmentLogic'
import { Car, Traveler } from '../types'

describe('assignmentLogic', () => {
  describe('shuffleArray', () => {
    it('should return an array of the same length', () => {
      const input = [1, 2, 3, 4, 5]
      const result = shuffleArray(input)
      expect(result).toHaveLength(input.length)
    })

    it('should contain all original elements', () => {
      const input = [1, 2, 3, 4, 5]
      const result = shuffleArray(input)
      expect(result.sort()).toEqual(input.sort())
    })

    it('should not mutate the original array', () => {
      const input = [1, 2, 3, 4, 5]
      const original = [...input]
      shuffleArray(input)
      expect(input).toEqual(original)
    })
  })

  describe('validateAssignment', () => {
    const createCar = (id: number, capacity: number): Car => ({
      id,
      name: `Car ${id}`,
      capacity
    })

    const createTraveler = (id: number, canDrive: boolean, isChild: boolean): Traveler => ({
      id,
      name: `Person ${id}`,
      canDrive,
      isChild
    })

    it('should return error when no cars provided', () => {
      const result = validateAssignment([], [createTraveler(1, true, false)])
      expect(result).toEqual({
        hasError: true,
        message: 'Please add at least one car'
      })
    })

    it('should return error when no travelers provided', () => {
      const result = validateAssignment([createCar(1, 4)], [])
      expect(result).toEqual({
        hasError: true,
        message: 'Please add at least one traveler'
      })
    })

    it('should return error when not enough drivers', () => {
      const cars = [createCar(1, 4), createCar(2, 4)]
      const travelers = [
        createTraveler(1, true, false),
        createTraveler(2, false, false)
      ]
      const result = validateAssignment(cars, travelers)
      expect(result).toEqual({
        hasError: true,
        message: 'Not enough drivers! You need 2 drivers but only have 1'
      })
    })

    it('should return error when not enough capacity', () => {
      const cars = [createCar(1, 2)]
      const travelers = [
        createTraveler(1, true, false),
        createTraveler(2, false, false),
        createTraveler(3, false, false)
      ]
      const result = validateAssignment(cars, travelers)
      expect(result).toEqual({
        hasError: true,
        message: 'Not enough space! Total capacity is 2 but you have 3 travelers'
      })
    })

    it('should return null when validation passes', () => {
      const cars = [createCar(1, 4)]
      const travelers = [
        createTraveler(1, true, false),
        createTraveler(2, false, false)
      ]
      const result = validateAssignment(cars, travelers)
      expect(result).toBeNull()
    })
  })

  describe('assignRoles', () => {
    let randomSpy: any

    beforeEach(() => {
      // Mock Math.random to make tests deterministic
      let callCount = 0
      randomSpy = vi.spyOn(Math, 'random').mockImplementation(() => {
        // Return predictable sequence
        return (callCount++ % 10) / 10
      })
    })

    afterEach(() => {
      randomSpy.mockRestore()
    })

    const createCar = (id: number, capacity: number): Car => ({
      id,
      name: `Car ${id}`,
      capacity
    })

    const createTraveler = (id: number, name: string, canDrive: boolean, isChild: boolean): Traveler => ({
      id,
      name,
      canDrive,
      isChild
    })

    it('should assign drivers to each car', () => {
      const cars = [createCar(1, 4), createCar(2, 4)]
      const travelers = [
        createTraveler(1, 'Alice', true, false),
        createTraveler(2, 'Bob', true, false),
        createTraveler(3, 'Charlie', false, false)
      ]

      const result = assignRoles(cars, travelers)

      if (result.hasError) {
        throw new Error('Should not have error')
      }

      expect(result.assignments).toHaveLength(2)
      expect(result.assignments[0].driver.canDrive).toBe(true)
      expect(result.assignments[1].driver.canDrive).toBe(true)
    })

    it('should assign navigators to adults only', () => {
      const cars = [createCar(1, 4)]
      const travelers = [
        createTraveler(1, 'Driver', true, false),
        createTraveler(2, 'Adult', false, false),
        createTraveler(3, 'Child', false, true)
      ]

      const result = assignRoles(cars, travelers)

      if (result.hasError) {
        throw new Error('Should not have error')
      }

      const assignment = result.assignments[0]
      expect(assignment.navigator).not.toBeNull()
      expect(assignment.navigator?.isChild).toBe(false)
    })

    it('should have no navigator when only children are passengers', () => {
      const cars = [createCar(1, 4)]
      const travelers = [
        createTraveler(1, 'Driver', true, false),
        createTraveler(2, 'Child1', false, true),
        createTraveler(3, 'Child2', false, true)
      ]

      const result = assignRoles(cars, travelers)

      if (result.hasError) {
        throw new Error('Should not have error')
      }

      const assignment = result.assignments[0]
      expect(assignment.navigator).toBeNull()
      expect(assignment.backSeat).toHaveLength(2)
      expect(assignment.backSeat.every(p => p.isChild)).toBe(true)
    })

    it('should distribute passengers across multiple cars', () => {
      const cars = [createCar(1, 3), createCar(2, 3)]
      const travelers = [
        createTraveler(1, 'Driver1', true, false),
        createTraveler(2, 'Driver2', true, false),
        createTraveler(3, 'Passenger1', false, false),
        createTraveler(4, 'Passenger2', false, false),
        createTraveler(5, 'Passenger3', false, false)
      ]

      const result = assignRoles(cars, travelers)

      if (result.hasError) {
        throw new Error('Should not have error')
      }

      expect(result.assignments).toHaveLength(2)

      // Count total passengers assigned
      const totalAssigned = result.assignments.reduce((sum, assignment) => {
        const passengerCount =
          1 + // driver
          (assignment.navigator ? 1 : 0) +
          assignment.backSeat.length
        return sum + passengerCount
      }, 0)

      expect(totalAssigned).toBe(5)
    })

    it('should not exceed car capacity', () => {
      const cars = [createCar(1, 4)]
      const travelers = [
        createTraveler(1, 'Driver', true, false),
        createTraveler(2, 'P1', false, false),
        createTraveler(3, 'P2', false, false),
        createTraveler(4, 'P3', false, false)
      ]

      const result = assignRoles(cars, travelers)

      if (result.hasError) {
        throw new Error('Should not have error')
      }

      const assignment = result.assignments[0]
      const totalInCar =
        1 + // driver
        (assignment.navigator ? 1 : 0) +
        assignment.backSeat.length

      expect(totalInCar).toBeLessThanOrEqual(cars[0].capacity)
    })

    it('should use extra drivers as passengers', () => {
      const cars = [createCar(1, 4)]
      const travelers = [
        createTraveler(1, 'Driver1', true, false),
        createTraveler(2, 'Driver2', true, false),
        createTraveler(3, 'Driver3', true, false)
      ]

      const result = assignRoles(cars, travelers)

      if (result.hasError) {
        throw new Error('Should not have error')
      }

      expect(result.assignments).toHaveLength(1)

      const assignment = result.assignments[0]
      const totalInCar =
        1 + // driver
        (assignment.navigator ? 1 : 0) +
        assignment.backSeat.length

      expect(totalInCar).toBe(3) // All three people should be assigned
    })

    it('should return error for invalid inputs', () => {
      const result = assignRoles([], [])
      expect(result.hasError).toBe(true)
      if (result.hasError) {
        expect(result.message).toBe('Please add at least one car')
      }
    })

    it('should handle single driver and single car scenario', () => {
      const cars = [createCar(1, 2)]
      const travelers = [createTraveler(1, 'Solo Driver', true, false)]

      const result = assignRoles(cars, travelers)

      if (result.hasError) {
        throw new Error('Should not have error')
      }

      expect(result.assignments).toHaveLength(1)
      expect(result.assignments[0].driver.name).toBe('Solo Driver')
      expect(result.assignments[0].navigator).toBeNull()
      expect(result.assignments[0].backSeat).toHaveLength(0)
    })
  })
})
