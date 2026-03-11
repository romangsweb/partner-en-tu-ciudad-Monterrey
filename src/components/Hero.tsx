import './Hero.css';

export default function Hero() {
    return (
        <section className="hero-section">
            <div className="hero-background">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
                <div className="blob blob-3"></div>
            </div>
            <div className="container hero-content animate-fade-in">
                <div className="hero-grid">
                    <div className="hero-text-block">
                        <div className="badge">Business Transformation Orbit</div>
                        <h1 className="hero-title">
                            La transformación de tu negocio en <span className="text-gradient">Monterrey</span> no termina en el Go-Live. <br />Apenas empieza.
                        </h1>
                        <p className="hero-subtitle">
                            Acompañamos a las empresas medianas en México a evolucionar su modelo de negocio, no solo a implementar software. Más de 26 años de experiencia respaldan nuestro enfoque estratégico.
                        </p>
                        <div className="hero-ctas">
                            <a href="#contacto" className="btn btn-primary btn-large">Agenda tu diagnóstico gratuito</a>
                            <a href="/cuestionario" className="btn btn-outline btn-large">Descubre tu nivel en 2 min</a>
                        </div>
                    </div>

                    <div className="hero-visual-block">
                        <div className="hero-orbit-container">
                            <div className="hero-orbit-outer"></div>
                            <div className="hero-orbit-middle"></div>
                            <div className="hero-orbit-inner"></div>
                            <div className="hero-orbit-center">
                                <span className="hero-orbit-text">Xamai<br />Orbit</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
