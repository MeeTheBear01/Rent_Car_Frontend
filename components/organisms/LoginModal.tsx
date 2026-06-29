'use client';

import React from 'react';
import { Modal, Button, Tag } from 'antd';

type AuthUser = {
  email: string;
  name: string;
  picture?: string;
  role: 'user' | 'admin';
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  session: { user: AuthUser } | null;
  GOOGLE_CLIENT_ID: string;
  googleButtonRef: React.RefObject<HTMLDivElement | null>;
  authLoading: boolean;
  authMessage: string;
  logout: () => void;
};

const LoginModal: React.FC<Props> = ({
  isOpen,
  onClose,
  session,
  GOOGLE_CLIENT_ID,
  googleButtonRef,
  authLoading,
  authMessage,
  logout,
}) => {
  const [profileImageError, setProfileImageError] = React.useState(false);
  const isAdmin = session?.user.role === 'admin';

  return (
    <Modal
      title={session ? 'Account Profile' : 'Login to Book'}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={550}
    >
      {session ? (
        <div className="profile-row" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {session.user.picture && !profileImageError ? (
            <img
              src={session.user.picture}
              alt={session.user.name}
              style={{ width: 60, height: 60, borderRadius: '50%' }}
              onError={() => setProfileImageError(true)}
            />
          ) : (
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: '#9b55ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
              }}
            >
              {session.user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div style={{ flex: 1 }}>
            <strong>{session.user.name}</strong>
            <p style={{ margin: '4px 0 8px 0', fontSize: '12px', color: '#999' }}>
              {session.user.email}
            </p>
            <Tag color={isAdmin ? 'purple' : 'blue'} style={!isAdmin ? { width:"10%" }:{width:"13%"}}>{session.user.role}</Tag>
          <Button type="primary" danger onClick={logout}>
            Logout
          </Button>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: '24px', color: '#999' }}>
            Sign in with Google to book rental cars and manage your reservations.
          </p>
          {GOOGLE_CLIENT_ID ? (
            <div ref={googleButtonRef} className="google-button" style={{ marginBottom: '16px' }} />
          ) : (
            <p style={{ color: '#ff4d4f' }}>
              Set NEXT_PUBLIC_GOOGLE_CLIENT_ID in the frontend env to enable Google login.
            </p>
          )}
          {authLoading ? <p style={{ color: '#1890ff' }}>Signing in...</p> : null}
          {authMessage ? <p style={{ color: '#ff4d4f', marginTop: '12px' }}>{authMessage}</p> : null}
        </div>
      )}
    </Modal>
  );
};

export default LoginModal;
