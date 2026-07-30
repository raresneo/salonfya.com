import React from 'react';
import { Link } from 'react-router-dom';

import { COLLECTIONS } from '../data/catalog';
import { SALON } from '../data/salon';

const Footer: React.FC = () => (
  <footer className="foot">
    <div className="foot-top">
      <div>
        <p className="foot-mark">FYA</p>
        <p>
          Atelier de rochii de mireasă și de seară. Design, execuție și reparații făcute la noi, în Oradea.
        </p>
      </div>

      <div className="foot-col">
        <h4>Colecții</h4>
        <ul>
          {COLLECTIONS.map((item) => (
            <li key={item.slug}>
              <Link to={item.path}>{item.collection}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="foot-col">
        <h4>Salon</h4>
        <ul>
          <li>
            <Link to="/colectii">Toate rochiile</Link>
          </li>
          <li>
            <Link to="/atelier">Atelierul</Link>
          </li>
          <li>
            <Link to="/programare">Programare probă</Link>
          </li>
        </ul>
      </div>

      <div className="foot-col">
        <h4>Contact</h4>
        <ul>
          <li>
            <a href={`tel:${SALON.phoneHref}`}>{SALON.phone}</a>
          </li>
          <li>
            <a href={`https://wa.me/${SALON.whatsapp}`} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </li>
          <li>
            <a href={`mailto:${SALON.email}`}>{SALON.email}</a>
          </li>
          <li>
            <a href={SALON.maps} target="_blank" rel="noreferrer">
              {SALON.street}
            </a>
          </li>
          {/* Afișate doar când avem URL real, ca să nu trimitem pe pagini goale. */}
          {SALON.instagram && (
            <li>
              <a href={SALON.instagram} target="_blank" rel="noreferrer">
                Instagram
              </a>
            </li>
          )}
          {SALON.facebook && (
            <li>
              <a href={SALON.facebook} target="_blank" rel="noreferrer">
                Facebook
              </a>
            </li>
          )}
        </ul>
      </div>
    </div>

    <div className="foot-bot">
      <span>
        &copy; {new Date().getFullYear()} Salon FYA · {SALON.addressFull}
      </span>
      <span>Rochii de mireasă · rochii de seară · ajustări în atelier</span>
    </div>
  </footer>
);

export default Footer;
