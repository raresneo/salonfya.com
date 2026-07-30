import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

import { COLLECTIONS } from '../data/catalog';

type NavProps = {
  solid: boolean;
  /** Paginile fără hero întunecat au nevoie de nav pe text închis de la start. */
  forceInk?: boolean;
  wishlistCount: number;
};

const Nav: React.FC<NavProps> = ({ solid, forceInk, wishlistCount }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle('is-locked', open);
    return () => document.body.classList.remove('is-locked');
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const classes = ['nav', solid ? 'solid' : '', forceInk && !solid ? 'ink' : ''].filter(Boolean).join(' ');

  return (
    <>
      <nav className={classes}>
        <Link to="/" className="mark" aria-label="Salon FYA, acasă">
          FYA
        </Link>

        <div className="nav-set nav-wide">
          <NavLink to="/colectii" className={({ isActive }) => `nav-link${isActive ? ' on' : ''}`}>
            Colecții
          </NavLink>
          <NavLink to="/atelier" className={({ isActive }) => `nav-link${isActive ? ' on' : ''}`}>
            Atelier
          </NavLink>
          <NavLink to="/programare" className={({ isActive }) => `nav-link${isActive ? ' on' : ''}`}>
            Programare
            {wishlistCount > 0 && <span className="nav-count tnum">{wishlistCount}</span>}
          </NavLink>
        </div>

        <div className="nav-set">
          <Link className="btn nav-wide" to="/programare">
            <span>Programează o probă</span>
            <i>&rarr;</i>
          </Link>
          <button
            className="burger"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={open ? 'Închide meniul' : 'Deschide meniul'}
          >
            <i />
            <i />
          </button>
        </div>
      </nav>

      <div className={`sheet${open ? ' open' : ''}`} aria-hidden={!open}>
        <button className="sheet-close" onClick={() => setOpen(false)}>
          Închide
        </button>
        <span className="sheet-sub">Colecții</span>
        {COLLECTIONS.map((item) => (
          <Link key={item.slug} to={item.path}>
            {item.collection}
          </Link>
        ))}
        <span className="sheet-sub" style={{ marginTop: 24 }}>
          Salon
        </span>
        <Link to="/atelier">Atelier</Link>
        <Link to="/programare">Programare</Link>
      </div>
    </>
  );
};

export default Nav;
