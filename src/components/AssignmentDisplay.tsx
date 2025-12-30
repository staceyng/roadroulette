import { Assignment } from '../types'

interface AssignmentDisplayProps {
  assignments: Assignment[]
  onShuffle: () => void
  onReset: () => void
}

function AssignmentDisplay({ assignments, onShuffle, onReset }: AssignmentDisplayProps) {
  return (
    <div className="results-section">
      <h2>Your road trip assignments!</h2>

      <div className="assignments">
        {assignments.map((assignment, index) => (
          <div key={index} className="car-assignment">
            <h3 className="car-title">
              🚗 {assignment.car.name}
              <span className="capacity-badge">{assignment.car.capacity} seats</span>
            </h3>

            <div className="role-section">
              <div className="role driver-role">
                <div className="role-icon">🚗</div>
                <div className="role-content">
                  <div className="role-label">Driver</div>
                  <div className="role-name">
                    {assignment.driver.name}
                    {assignment.driver.isChild && <span className="child-indicator"> 👶</span>}
                  </div>
                </div>
              </div>

              {assignment.navigator && (
                <div className="role navigator-role">
                  <div className="role-icon">🧭</div>
                  <div className="role-content">
                    <div className="role-label">Navigator</div>
                    <div className="role-name">
                      {assignment.navigator.name}
                      {assignment.navigator.isChild && <span className="child-indicator"> 👶</span>}
                    </div>
                  </div>
                </div>
              )}

              {assignment.backSeat.length > 0 && (
                <div className="role backseat-role">
                  <div className="role-icon">💺</div>
                  <div className="role-content">
                    <div className="role-label">E²C²</div>
                    <div className="role-names">
                      {assignment.backSeat.map((person, idx) => (
                        <div key={idx} className="role-name">
                          {person.name}
                          {person.isChild && <span className="child-indicator"> 👶</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="action-buttons">
        <button onClick={onShuffle} className="primary-button">
          🔄 Shuffle again
        </button>
        <button onClick={onReset} className="secondary-button">
          ← Start over
        </button>
      </div>
    </div>
  )
}

export default AssignmentDisplay
