import { formatDate, safeText } from '../utils/formatters';

export function PastRewards({ past }) {
  if (!past || past.length === 0) {
    return <div className="muted">No past rewards yet.</div>;
  }

  return (
    <div className="gridCards">
      {past.map((reward) => (
        <div key={reward.id} className="miniCard">
          <div className="miniCard__imgWrap">
            <img 
              className="miniCard__img" 
              src={safeText(reward.prize_image)} 
              alt="Prize" 
            />
          </div>
          <div className="miniCard__body">
            <div className="miniCard__title">
              {safeText(reward.prize_name || 'Prize')}
            </div>
            {reward.winner_display ? (
              <div className="small muted">
                Winner: <span className="mono">{safeText(reward.winner_display)}</span>
              </div>
            ) : (
              <div className="small muted">Winner: —</div>
            )}
            {reward.unlocked_at && (
              <div className="small muted">
                Unlocked: {formatDate(reward.unlocked_at)}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
