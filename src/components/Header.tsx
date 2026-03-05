'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import './Header.css';

export default function Header() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`header ${scrolled ? 'scrolled glass-panel' : ''}`}>
            <div className="container header-content">
                <Link href="/" className="logo">
                    <img src="https://www.xamai.com/wp-content/uploads/2023/09/Logo-Xamai.png" alt="Xamai Logo" style={{ height: '40px', objectFit: 'contain' }} />
                </Link>
                <nav className="desktop-nav">
                    <Link href="#framework" className="nav-link">Framework</Link>
                    <Link href="#cycle" className="nav-link">El Ciclo</Link>
                    <Link href="#services" className="nav-link">Servicios</Link>
                    <Link href="#about" className="nav-link">Nosotros</Link>
                </nav>
                <div className="cta-wrapper">
                    <a href="#contacto" className="btn btn-primary">Agenda tu diagnóstico</a>
                </div>
            </div>
        </header>
    );
}
