import { useState } from "react";
import { Car } from "../types";

interface CarInputProps {
  cars: Car[];
  setCars: (cars: Car[]) => void;
}

function CarInput({ cars, setCars }: CarInputProps) {
  const [carName, setCarName] = useState<string>("");
  const [capacity, setCapacity] = useState<number>(4);

  const addCar = () => {
    if (capacity < 2) {
      alert("Car must have at least 2 seats (driver + 1 passenger)");
      return;
    }

    const finalCarName = carName.trim() || `Car ${cars.length + 1}`;

    const newCar: Car = {
      id: Date.now(),
      name: finalCarName,
      capacity: Number(capacity),
    };

    setCars([...cars, newCar]);
    setCarName("");
    setCapacity(4);
  };

  const removeCar = (id: number) => {
    setCars(cars.filter((car) => car.id !== id));
  };

  return (
    <div className="input-card">
      <h2>🚙 Cars</h2>

      <div className="input-group">
        <input
          type="text"
          placeholder="Car name"
          value={carName}
          onChange={(e) => setCarName(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addCar()}
        />
        <div className="capacity-input">
          <label>Capacity:</label>
          <input
            type="number"
            min="2"
            max="12"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
          />
        </div>
        <button onClick={addCar} className="add-button">
          + Add car
        </button>
      </div>

      {cars.length > 0 && (
        <div className="list">
          {cars.map((car) => (
            <div key={car.id} className="list-item">
              <div className="list-item-content">
                <span className="item-name">{car.name}</span>
                <span className="item-detail">({car.capacity} seats)</span>
              </div>
              <button
                onClick={() => removeCar(car.id)}
                className="remove-button"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CarInput;
