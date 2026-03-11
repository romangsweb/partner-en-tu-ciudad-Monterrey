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

    const getIcon = (num: string) => {
        switch (num) {
            case "01": return (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            );
            case "02": return (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
            );
            case "03": return (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            );
            case "04": return (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            );
        }
    }

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
                            <span className="pillar-bg-num">{pillar.num}</span>
                            <div className="pillar-icon-wrapper">
                                {getIcon(pillar.num)}
                            </div>
                            <h3 className="pillar-title">{pillar.title}</h3>
                            <p className="pillar-desc">{pillar.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
