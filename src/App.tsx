import { useState } from "react";
import "./App.css";
import CarInput from "./components/CarInput";
import TravelerInput from "./components/TravelerInput";
import AssignmentDisplay from "./components/AssignmentDisplay";
import { Car, Traveler, Assignment } from "./types";
import { assignRoles as assignRolesUtil } from "./utils/assignmentLogic";

function App() {
  const [cars, setCars] = useState<Car[]>([]);
  const [travelers, setTravelers] = useState<Traveler[]>([]);
  const [assignments, setAssignments] = useState<Assignment[] | null>(null);
  const [error, setError] = useState<string>("");

  const assignRoles = () => {
    setError("");

    const result = assignRolesUtil(cars, travelers);

    if (result.hasError) {
      setError(result.message);
      return;
    }

    setAssignments(result.assignments);
  };

  const reset = () => {
    setCars([]);
    setTravelers([]);
    setAssignments(null);
    setError("");
  };

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
              🎲 Assign roles
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
  );
}

export default App;
