
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const LINKS = {
  employee: [
    { path: "/dashboard", label: "Dashboard", icon: <GridIcon /> },
    { path: "/goals", label: "My Goals", icon: <TargetIcon /> },
    { path: "/checkins", label: "Check-ins", icon: <CheckIcon /> },
  ],
  manager: [
    { path: "/dashboard", label: "Dashboard", icon: <GridIcon /> },
    { path: "/team", label: "Team Goals", icon: <UsersIcon /> },
    { path: "/reviews", label: "Quarterly Reviews", icon: <FileIcon /> },
  ],
  admin: [
    { path: "/dashboard", label: "Dashboard", icon: <GridIcon /> },
    { path: "/team", label: "All Goals", icon: <UsersIcon /> },
    { path: "/reports", label: "Reports", icon: <BarIcon /> },
    { path: "/audit", label: "Audit Log", icon: <SearchIcon /> },
  ],
};

const ROLE_COLORS = { admin: "#818cf8", manager: "#22d3ee", employee: "#34d399" };

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);

  useEffect(() => {
   axios
  .get("/api/notifications")
  .then(r => setNotifications(Array.isArray(r.data) ? r.data : []))
  .catch(() => setNotifications([]));
  }, []);

  const links = LINKS[user?.role] || LINKS.employee;

  return (
    <div style={S.sidebar}>
      {/* Logo */}
      <div style={S.logo}>
        <div style={S.logoIcon}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5"/>
            <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="1.5"/>
            <circle cx="12" cy="12" r="1" fill="white"/>
          </svg>
        </div>
        <span style={S.logoText}>Orbit</span>
      </div>

      {/* Nav */}
      <nav style={S.nav}>
        <div style={S.navLabel}>Navigation</div>
        {links.map(l => {
          const active = pathname === l.path;
          return (
            <button key={l.path} onClick={() => navigate(l.path)}
              style={{ ...S.navItem, ...(active ? S.navActive : {}) }}>
              <span style={{ ...S.navIcon, ...(active ? S.navIconActive : {}) }}>{l.icon}</span>
              <span>{l.label}</span>
              {active && <div style={S.activeDot} />}
            </button>
          );
        })}
      </nav>

      <div style={S.spacer} />

      {/* Notifications */}
      <div style={{ position: 'relative', padding: '0 12px 8px' }}>
        <button onClick={() => setShowNotif(!showNotif)} style={S.notifBtn}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BellIcon />
            <span>Notifications</span>
          </span>
          {notifications.length > 0 && (
            <span style={S.badge}>{notifications.length}</span>
          )}
        </button>

        {showNotif && (
          <div style={S.dropdown}>
            <div style={S.dropdownHeader}>Notifications</div>
            {notifications.length === 0 ? (
              <div style={S.dropdownEmpty}>All caught up</div>
            ) : (Array.isArray(notifications) ? notifications : []).map(n => (
              <div key={n.id} style={S.dropdownItem}>
                <div style={S.notifMsg}>{n.message}</div>
                <div style={S.notifTime}>{new Date(n.created_at).toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User */}
      <div style={S.userSection}>
        <div style={S.avatar}>{user?.name?.[0]?.toUpperCase()}</div>
        <div style={S.userInfo}>
          <div style={S.userName}>{user?.name}</div>
          <div style={{ ...S.roleBadge, color: ROLE_COLORS[user?.role] || '#94a3b8' }}>
            {user?.role}
          </div>
        </div>
        <button onClick={logout} style={S.logoutBtn} title="Logout">
          <LogoutIcon />
        </button>
      </div>
    </div>
  );
}

const S = {
  sidebar: { width: '220px', minHeight: '100vh', background: '#0f172a', display: 'flex', flexDirection: 'column', borderRight: '1px solid #1e293b', flexShrink: 0 },
  logo: { display: 'flex', alignItems: 'center', gap: '10px', padding: '20px 16px 16px' },
  logoIcon: { width: '28px', height: '28px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  logoText: { color: 'white', fontSize: '16px', fontWeight: '700', letterSpacing: '-0.3px' },
  nav: { padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '2px' },
  navLabel: { fontSize: '10px', fontWeight: '600', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '8px 8px 6px' },
  navItem: { display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '8px 10px', borderRadius: '8px', border: 'none', background: 'transparent', color: '#94a3b8', fontSize: '13px', fontWeight: '500', cursor: 'pointer', textAlign: 'left', position: 'relative', transition: 'all 0.15s' },
  navActive: { background: '#1e293b', color: '#e2e8f0' },
  navIcon: { display: 'flex', opacity: 0.6 },
  navIconActive: { opacity: 1 },
  activeDot: { width: '5px', height: '5px', borderRadius: '50%', background: '#6366f1', marginLeft: 'auto' },
  spacer: { flex: 1 },
  notifBtn: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#94a3b8', fontSize: '13px', cursor: 'pointer' },
  badge: { background: '#ef4444', color: 'white', borderRadius: '999px', padding: '1px 7px', fontSize: '11px', fontWeight: '700' },
  dropdown: { position: 'absolute', bottom: '48px', left: '12px', right: '12px', background: 'white', borderRadius: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', zIndex: 999, maxHeight: '280px', overflowY: 'auto' },
  dropdownHeader: { padding: '12px 14px 8px', fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #f1f5f9' },
  dropdownEmpty: { padding: '16px 14px', color: '#94a3b8', fontSize: '13px' },
  dropdownItem: { padding: '12px 14px', borderBottom: '1px solid #f8fafc' },
  notifMsg: { fontSize: '13px', fontWeight: '500', color: '#111827', marginBottom: '3px' },
  notifTime: { fontSize: '11px', color: '#9ca3af' },
  userSection: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderTop: '1px solid #1e293b', margin: '0 0 0 0' },
  avatar: { width: '30px', height: '30px', borderRadius: '8px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  userInfo: { flex: 1, minWidth: 0 },
  userName: { fontSize: '13px', fontWeight: '600', color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  roleBadge: { fontSize: '11px', fontWeight: '500', textTransform: 'capitalize', marginTop: '1px' },
  logoutBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: '4px', display: 'flex', borderRadius: '6px' },
};

// Icons
function GridIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> }
function TargetIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg> }
function CheckIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9,11 12,14 22,4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> }
function UsersIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> }
function FileIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg> }
function BarIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> }
function SearchIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> }
function BellIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> }
function LogoutIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> }