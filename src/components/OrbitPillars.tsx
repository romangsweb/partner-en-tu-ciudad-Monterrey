import './OrbitPillars.css';

export default function OrbitPillars() {
    const pillars = [
        {
            num: "01",
            title: "Diagnóstico Real",
            desc: "Antes de comprometer presupuesto, identificamos la deuda técnica y la madurez de su ecosistema para trazar una ruta clara."
        },
        {
            num: "02",
            title: "Arquitectura Evolutiva",
            desc: "Implementamos con estrategia Clean Core. Diseño enfocado en el crecimiento a futuro, sin restricciones técnicas por personalización excesiva."
        },
        {
            num: "03",
            title: "Validación de Negocio",
            desc: "Ejecución ágil entregando valor real en cada iteración, alineando siempre la tecnología con los KPIs del modelo de negocio."
        },
        {
            num: "04",
            title: "Evolución Continua",
            desc: "Soporte activo y estratégico después del Go-Live a través de Xtended Care. El ecosistema es un ente vivo que no envejece, evoluciona."
        }
    ];

    return (
        <section id="framework" className="section orbit-pillars">
            <div className="container">
                <div className="section-header text-center">
                    <h2 className="section-title">La transformación es un ciclo, no un proyecto.</h2>
                    <p className="section-subtitle">Cómo estructuramos el valor frente a la complejidad tecnológica y de negocio de Monterrey.</p>
                </div>

                <div className="grid grid-2 grid-4-lg pillars-grid">
                    {pillars.map((pillar, idx) => (
                        <div key={idx} className="pillar-card glass-panel">
                            <span className="pillar-num text-gradient">{pillar.num}</span>
                            <h3 className="pillar-title">{pillar.title}</h3>
                            <p className="pillar-desc">{pillar.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
