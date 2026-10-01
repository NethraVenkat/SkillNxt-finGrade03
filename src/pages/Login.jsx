import React from 'react';
/* ══════════════ pages/LoginPage.jsx ══════════════ */
function Login({ onClose }) {
  return (
    <div className="modal" onClick={onClose}>
      <div className="loginbox" onClick={e => e.stopPropagation()}>
        <button className="x" onClick={onClose} aria-label="Close">×</button>
        <h3>Sign in to Money Quest</h3>
        <p>Teachers sign in to save class progress.</p>
        <label>Email</label>
        <input type="email" placeholder="teacher@school.edu"/>
        <label>Password</label>
        <input type="password" placeholder="••••••••"/>
        <button className="go" onClick={onClose}>Sign in</button>
      </div>
    </div>
  );
}

export { Login };
