import './Credibility.css';

export default function Credibility() {
    return (
        <section id="about" className="section credibility-section">
            <div className="container">
                <div className="grid grid-2">
                    <div className="cred-text">
                        <h2 className="section-title">De la implementación estática a la evolución continua</h2>
                        <p className="section-subtitle">Lo que nos diferencia como Gold Partner para medianas empresas.</p>

                        <ul className="cred-list">
                            <li>
                                <strong>Más de 26 años de experiencia:</strong> No experimentamos. Traemos casos comprobados.
                            </li>
                            <li>
                                <strong>Especialistas en la región (Monterrey / NL):</strong> Entendimiento profundo de las dinámicas industriales y logísticas locales.
                            </li>
                            <li>
                                <strong>Foco en Xtended Care:</strong> No somos la consultora que desaparece. Somos su brazo extendido.
                            </li>
                            <li>
                                <strong>Top 3 Partner SAP en México:</strong> Galardonados consistentemente por entregas exitosas.
                            </li>
                        </ul>
                    </div>

                    <div className="experiencia-timeline glass-panel">
                        <h3 className="timeline-title">Nuestra historia de innovación</h3>
                        <div className="timeline-item">
                            <span className="year">1999</span>
                            <p>Fundación: Enfoque pionero en digitalización.</p>
                        </div>
                        <div className="timeline-item">
                            <span className="year">2005</span>
                            <p>Primera implementación de Business One en MX.</p>
                        </div>
                        <div className="timeline-item">
                            <span className="year">2016</span>
                            <p>Adopción temprana de arquitectura Cloud (HANA).</p>
                        </div>
                        <div className="timeline-item highlight">
                            <span className="year">2024</span>
                            <p>Lanzamiento del modelo Business Transformation Orbit.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
