import './Footer.css';

export default function Footer() {
    return (
        <footer id="contacto" className="footer text-center">
            <div className="container">
                <h2 className="footer-title">¿En qué momento está tu empresa?</h2>
                <p className="footer-subtitle">
                    No necesitas saber exactamente qué licencia SAP necesitas. Solo necesitas tener la conversación correcta con expertos locales en Monterrey.
                </p>
                <div className="footer-cta">
                    <a href="/cuestionario" className="btn btn-primary btn-large">
                        Agendar Diagnóstico sin costo
                    </a>
                </div>
                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} Xamai Partner SAP. Diseñado para la evolución de negocios en Monterrey, México.</p>
                </div>
            </div>
        </footer>
    );
}
