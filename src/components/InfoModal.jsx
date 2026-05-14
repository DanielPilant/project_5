export default function InfoModal({ user, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>User Info</h2>
        <ul>
          {Object.entries(user)
            .filter(([key]) => key !== 'website')
            .map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {String(value)}
              </li>
            ))}
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
