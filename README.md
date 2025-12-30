# Road Roulette

A quick and fun way to assign seats for different cars during road trips.Road Roulette handles the randomization for you!

## Description

Road Roulette app automatically generates random seat assignments, making the process faster and more efficient.

## Features

- **Automatic Assignments**: Instantly generate random seat assignments for multiple cars
- **Re-shuffling**: Don't like the current arrangement? Re-shuffle with a single click
- Fast and intuitive interface
- Perfect for group road trips with multiple vehicles

## Technologies Used

- React
- Vite
- TypeScript
- Vitest (Unit Testing)
- ESLint

## Installation

1. Clone the repository:

```bash
git clone https://github.com/staceyng/roadroulette.git
cd roadroulette
```

2. Install dependencies:

```bash
npm install
```

## How to Run

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the port shown in your terminal).

## Build for Production

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Testing

This project includes comprehensive unit tests for the core assignment logic.

### Run Tests

Run tests in watch mode:

```bash
npm test
```

Run tests once:

```bash
npm test -- --run
```

Run tests with UI:

```bash
npm run test:ui
```

Run tests with coverage report:

```bash
npm run test:coverage
```

### Test Coverage

The test suite includes 16 unit tests covering:

- Assignment validation (cars, travelers, drivers, capacity)
- Driver and navigator assignment logic
- Passenger distribution across multiple cars
- Edge cases (children-only scenarios, single driver, etc.)
- Randomization functionality

## Future Improvements

- Add ability to save favorite seat configurations
- Support for custom seat naming/labeling
- Option to lock certain passengers to specific cars
- History of previous assignments
- Export/share assignments with the group
- Support for seat preferences and constraints
