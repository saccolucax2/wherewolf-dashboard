import {
  Heart,
  Minus,
  Plus,
  Skull,
  Sparkles,
  Trash2
} from "lucide-react";

import './PlayerCard.css';

export default function PlayerCard({
  player,
  roleInfo,
  gameStarted,
  FAZIONI_POSSIBILI,

  updateField,
  incrementVote,
  decrementVote,
  toggleStatus,
  removePlayer
}) {
  const isDead = player.status === "morto";
  let currentAura = roleInfo.aura;
  // --- LOGICA SWIPE E FLIP ---
  const [isFlipped, setIsFlipped] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const onTouchStart = (e) => {
    const targetTag = e.target.tagName.toLowerCase();
    if (targetTag === 'input' || targetTag === 'select' || targetTag === 'button' || targetTag === 'svg' || targetTag === 'path') return;
    
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEndEvent = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isSwipe = Math.abs(distance) > 50;
    if (isSwipe) setIsFlipped(!isFlipped);
  };

  if (player.fazione === "Vampiro")
    currentAura = "Oscura";

  if (
    player.fazione === "Lupi del Branco" &&
    roleInfo.fazione !== "Lupi del Branco"
  )
    currentAura = "Oscura";

  return (
    <div>
      className={`player-card-scene ${isDead ? "dead" : player.isBallot ? "ballot" : "alive"}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEndEvent}
    
      <div className={`player-card-inner ${isFlipped ? "flipped" : ""}`}>
        <div className="player-card-front">
          <div className="player-card-header">
            <div>
              <h2>{player.name}</h2>
            </div>
            <span
              className={`status-badge ${
                isDead ? "status-morto" : "status-vivo"
              }`}
            >
            {isDead ? "MORTO" : "VIVO"}
            </span>
          </div>

          {/* ================= GRID ================= */}
          <div className="player-grid">

            <div className="info-box">
              <label>Ruolo</label>
              <strong>{player.role}</strong>
            </div>

            <div className="info-box">
              <label>Mistico</label>
              <strong
                style={{
                  color:
                    roleInfo.misticismo === "Sì"
                      ? "#9333ea"
                      : "#888"
                }}
              >
                <Sparkles size={15} />
                {roleInfo.misticismo || "No"}
              </strong>
            </div>

            <div className="info-box">
              <label>Fazione</label>
              <select
                className="dark-input"
                value={player.fazione}
                onChange={(e) =>
                  updateField(
                    player.id,
                    "fazione",
                    e.target.value
                  )
                }
              >
                {FAZIONI_POSSIBILI.map((f) => (
                  <option
                    key={f}
                    value={f}
                  >
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div className="info-box">
              <label>Aura</label>
              <strong>{currentAura}</strong>
            </div>

            {/* ================= NOTES ================= */}

            <div className="info-box full">
              <label>Notes</label>
              <input
                className="dark-input"
                defaultValue={player.notes}
                placeholder="..."
                onBlur={(e) =>
                  updateField(
                    player.id,
                    "notes",
                    e.target.value
                  )
                }
              />
            </div>

            {/* ================= VOTES ================= */}

            {!isDead && (
              <div className="vote-card">
                <label>Votes</label>
                <div className="vote-controls">

                  <button
                    className="btn-action"
                    onClick={() =>
                      decrementVote(
                        player.id,
                        player.votes,
                        "votes"
                      )
                    }
                  >
                    <Minus size={18} />
                  </button>

                  <span className="vote-number">
                    {player.votes || 0}
                  </span>

                  <button
                    className="btn-action"
                      onClick={() =>
                        incrementVote(
                        player.id,
                        player.votes,
                        "votes"
                      )
                    }
                  >
                    <Plus size={18} />
                  </button>

                </div>
              </div>
            )}

            {/* ================= BALLOT ================= */}

            {!isDead && (
              <div className="ballot-card">

                <label>

                  <input
                    type="checkbox"
                    checked={player.isBallot || false}
                    onChange={(e) =>
                      updateField(
                        player.id,
                        "isBallot",
                        e.target.checked
                      )
                    }
                  />

                  Ballot Candidate

                </label>

                {player.isBallot && (

                  <div className="vote-controls">

                    <button
                      className="btn-action"
                      onClick={() =>
                        decrementVote(
                          player.id,
                          player.ballotVotes,
                          "ballotVotes"
                        )
                      }
                    >
                      <Minus size={18} />
                    </button>

                    <span className="vote-number ballot">
                      {player.ballotVotes || 0}
                    </span>

                    <button
                      className="btn-action"
                      onClick={() =>
                        incrementVote(
                          player.id,
                          player.ballotVotes,
                          "ballotVotes"
                        )
                      }
                    >
                      <Plus size={18} />
                    </button>

                  </div>
                )}
              </div>
            )}

            {/* ================= ACTIONS ================= */}

            <div className="player-actions">

              {gameStarted ? (

                <button
                  className={ !isDead ? "danger-btn" : "success-btn" }
                  onClick={() =>
                    toggleStatus(
                      player.id,
                      player.status
                    )
                  }
                >
                  {isDead ? (
                    <>
                      <Heart size={18} />
                      Revive
                    </>
                  ) : (
                    <>
                      <Skull size={18} />
                      Kill
                    </>
                  )}
                </button>

              ) : (

                <button
                  className="delete-btn"
                  onClick={() =>
                    removePlayer(player.id)
                  }
                >
                  <Trash2 size={18} />
                  Remove
                </button>

              )}
            </div>  
          </div>
        </div>
      </div>

      {/* LATO B */}
      <div className="player-card-back" onClick={() => setIsFlipped(false)}>
          <img 
            src={`/cards/${player.role}.png`} 
            alt={player.role} 
            onError={(e) => { e.target.src = '/cards/default.png'; }}
          />
      </div>
    </div>
  );
}