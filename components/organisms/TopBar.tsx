import React, { useState } from 'react';
import { Dropdown, Button, Tag } from 'antd';

type AuthUser = {
  email: string;
  name: string;
  picture?: string;
  role: 'user' | 'admin';
  contractId?: string;
};

type Props = {
  isAdmin: boolean;
  session: { user: AuthUser } | null;
  logout: () => void;
  onLoginClick: () => void;
};

const TopBar: React.FC<Props> = ({ isAdmin, session, logout, onLoginClick }) => {
  const [imageError, setImageError] = useState(false);
  const contractId = session?.user?.contractId;

  const avatarContent = session?.user.picture && !imageError ? (
    <img
      src={session.user.picture}
      alt={`${session.user.name} avatar`}
      className="navbar-avatar"
      style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
      onError={() => setImageError(true)}
    />
  ) : session ? (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: '#9b55ff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
      }}
    >
      {session.user.name.charAt(0).toUpperCase()}
    </div>
  ) : (
    <div className="role-pill">{isAdmin ? 'Admin' : 'User'}</div>
  );

  const overlay = (
    <div style={{ padding: 16, minWidth: 240, background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', borderRadius: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        {session?.user.picture && !imageError ? (
          <img
            src={session.user.picture}
            alt={`${session.user.name} avatar`}
            style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }}
            onError={() => setImageError(true)}
          />
        ) : (
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: '#9b55ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '20px',
              fontWeight: 'bold',
            }}
          >
            {session?.user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <strong>{session?.user.name}</strong>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: '#aaa' }}>{session?.user.email}</p>
          <Tag color={session?.user.role === 'admin' ? 'purple' : 'blue'} style={{ marginTop: 8 }}>
            {session?.user.role}
          </Tag>
        </div>
      </div>
      <Button type="primary" danger block onClick={logout}>
        Logout
      </Button>
    </div>
  );

  return (
    <nav className="topbar full-screen-nav" aria-label="Primary navigation">
      <a className="brand-mark" href="#home" aria-label="YouRent home">
        <span className="brand-car">YR</span>
        <span>
          YouRent
          <small>car rental</small>
        </span>
      </a>
      <div className="nav-links" aria-label="Sections">
        <a href="#home">Home</a>
        <a href="#how">How it works</a>
        <a href="#collection">Cars</a>
        <a href={contractId ? `/${contractId}` : '#'}>Manage booking</a>
      </div>
      <div style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {session ? (
          <Dropdown
            overlay={overlay}
            trigger={['click']}
            placement="bottomRight"
            arrow={{ pointAtCenter: true }}
            overlayStyle={{ backdropFilter: 'blur(10px)', borderRadius: 8 }}
          >
            <div style={{ cursor: 'pointer' }}>{avatarContent}</div>
          </Dropdown>
        ) : (
          <Button type="primary" onClick={onLoginClick}>
            Login
          </Button>
        )}
      </div>
    </nav>
  );
};

export default TopBar;
