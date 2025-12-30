import { useState } from "react";
import { Traveler } from "../types";

interface TravelerInputProps {
  travelers: Traveler[];
  setTravelers: (travelers: Traveler[]) => void;
}

function TravelerInput({ travelers, setTravelers }: TravelerInputProps) {
  const [travelerName, setTravelerName] = useState<string>("");
  const [canDrive, setCanDrive] = useState<boolean>(false);
  const [isChild, setIsChild] = useState<boolean>(false);

  const addTraveler = () => {
    if (!travelerName.trim()) {
      alert("Please enter a traveler name");
      return;
    }

    const newTraveler: Traveler = {
      id: Date.now(),
      name: travelerName.trim(),
      canDrive: isChild ? false : canDrive,
      isChild,
    };

    setTravelers([...travelers, newTraveler]);
    setTravelerName("");
    setCanDrive(false);
    setIsChild(false);
  };

  const removeTraveler = (id: number) => {
    setTravelers(travelers.filter((traveler) => traveler.id !== id));
  };

  const toggleCanDrive = (id: number) => {
    setTravelers(
      travelers.map((traveler) => {
        if (traveler.id === id && !traveler.isChild) {
          return { ...traveler, canDrive: !traveler.canDrive };
        }
        return traveler;
      }),
    );
  };

  const drivers = travelers.filter((t) => t.canDrive).length;
  const children = travelers.filter((t) => t.isChild).length;

  return (
    <div className="input-card">
      <h2>👥 Travelers</h2>

      <div className="input-group">
        <input
          type="text"
          placeholder="Traveler name"
          value={travelerName}
          onChange={(e) => setTravelerName(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addTraveler()}
        />
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={isChild}
              onChange={(e) => setIsChild(e.target.checked)}
            />
            Child
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={canDrive}
              onChange={(e) => setCanDrive(e.target.checked)}
              disabled={isChild}
            />
            Can drive
          </label>
        </div>
        <button onClick={addTraveler} className="add-button">
          + Add traveler
        </button>
      </div>

      {travelers.length > 0 && (
        <>
          <div className="stats">
            Total: {travelers.length} | Drivers: {drivers} | Children:{" "}
            {children}
          </div>
          <div className="list">
            {travelers.map((traveler) => (
              <div key={traveler.id} className="list-item">
                <div className="list-item-content">
                  <span className="item-name">{traveler.name}</span>
                  {traveler.isChild && (
                    <span className="driver-badge child-badge">👶 Child</span>
                  )}
                  {traveler.canDrive && (
                    <span className="driver-badge">🚗 Driver</span>
                  )}
                </div>
                <div className="list-item-actions">
                  {!traveler.isChild && (
                    <button
                      onClick={() => toggleCanDrive(traveler.id)}
                      className="toggle-button"
                      title={
                        traveler.canDrive
                          ? "Remove driver status"
                          : "Make driver"
                      }
                    >
                      {traveler.canDrive ? "🚗" : "➕"}
                    </button>
                  )}
                  <button
                    onClick={() => removeTraveler(traveler.id)}
                    className="remove-button"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default TravelerInput;
