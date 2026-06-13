import { COLORS } from '@/lib/constants';
import { IoLogoInstagram, IoLogoFacebook, IoLogoLinkedin } from 'react-icons/io5';

export default function Footer() {
  return (
    <footer className="px-6 py-6 text-center" style={{ backgroundColor: COLORS.primary, color: COLORS.card }}>
      <p className="font-titles text-lg mb-2">Mx Together</p>

      <div className="font-buttons text-sm mb-2">
        <span className="font-semibold">AYUDA</span>
        <span className="mx-2">·</span>
        <a href="https://www.alcoholicos-anonimos.org" target="_blank" rel="noopener noreferrer" className="font-semibold">
          ALCOHÓLICOS ANÓNIMOS
        </a>
      </div>

      <p className="font-body text-xs mb-4">
        Consume de manera responsable y solo si eres mayor de edad
      </p>

      <div className="flex justify-center gap-4 mb-2 text-xl">
        <a href="#" aria-label="Instagram"><IoLogoInstagram /></a>
        <a href="#" aria-label="Facebook"><IoLogoFacebook /></a>
        <a href="#" aria-label="LinkedIn"><IoLogoLinkedin /></a>
      </div>

      <p className="font-body text-xs">Pablo Pérez · MixTogether ©</p>
    </footer>
  );
}