import React from 'react';
import { Button, Tag } from 'antd';

type AuthUser = {
  email: string;
  name: string;
  picture?: string;
  role: 'user' | 'admin';
};

type Props = {
  session: { user: AuthUser } | null;
  GOOGLE_CLIENT_ID: string;
  googleButtonRef: React.RefObject<HTMLDivElement | null>;
  authLoading: boolean;
  authMessage: string;
  logout: () => void;
};

const AuthCard: React.FC<Props> = ({ session, GOOGLE_CLIENT_ID, googleButtonRef, authLoading, authMessage, logout }) => {
  const isAdmin = session?.user.role === 'admin';

  return (
    <section id="login" className="auth-section" aria-label="Login panel">
      <div>
        <p className="section-overline">Account access</p>
        <h2>
          Login to <span>Book</span>
        </h2>
        <p>
          Visitors can browse as users. Booking requires Google login. Admin dashboard appears
          only when the backend marks your email as admin.
        </p>
      </div>

      <div className="auth-card">
        {session ? (
          <div className="profile-row">
            {session.user.picture ? <img src={session.user.picture} alt={session.user.name} /> : null}
            <div>
              <strong>{session.user.name}</strong>
              <span>{session.user.email}</span>
              <Tag color={isAdmin ? 'purple' : 'blue'}>{session.user.role}</Tag>
            </div>
            <Button onClick={logout}>Logout</Button>
          </div>
        ) : (
          <>
            {GOOGLE_CLIENT_ID ? (
              <div ref={googleButtonRef} className="google-button" />
            ) : (
              <p className="auth-warning">
                Set NEXT_PUBLIC_GOOGLE_CLIENT_ID in the frontend env to enable Google login.
              </p>
            )}
            {authLoading ? <p className="auth-message">Signing in...</p> : null}
            {authMessage ? <p className="auth-warning">{authMessage}</p> : null}
          </>
        )}
      </div>
    </section>
  );
};

export default AuthCard;
