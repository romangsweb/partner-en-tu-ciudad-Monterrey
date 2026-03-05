'use client';
import { useState } from 'react';
import './TransformationCycle.css';

const steps = [
    {
        id: "genesis",
        title: "01 Origen (Digital Genesis)",
        headline: "Diagnóstico de deuda técnica y madurez.",
        quote: "\"Sin ese mapa, cualquier ruta es una suposición.\"",
        description: "Evaluamos su base instalada ECC o procesos legacy. Entendemos dónde duele antes de proponer cómo curarlo."
    },
    {
        id: "design",
        title: "02 Diseño (Future Architecture)",
        headline: "Co-diseño de arquitectura Clean Core.",
        quote: "\"Clean Core no es una restricción técnica. Es una decisión estratégica.\"",
        description: "Diseñamos un blueprint evolutivo. Nos aseguramos de mantener el core limpio para que las actualizaciones futuras fluyan sin interrupciones."
    },
    {
        id: "transformation",
        title: "03 Transformación (Agile Execution)",
        headline: "Implementación ágil con validación.",
        quote: "\"La validación constante es el seguro contra la obsolescencia.\"",
        description: "Cada iteración y sprint debe demostrar un retorno y acercar los procesos al objetivo financiero. Se acabó el Project Mindset monolítico."
    },
    {
        id: "evolution",
        title: "04 Evolución (Continuous Value)",
        headline: "Roadmap vivo y advisory permanente.",
        quote: "\"El sistema no envejece. Evoluciona.\"",
        description: "A través de Xtended Care (Operate, Evolve, Innovate), garantizamos que la plataforma se expanda junto con los retos de Monterrey y el mundo."
    }
];

export default function TransformationCycle() {
    const [activeStep, setActiveStep] = useState(0);

    return (
        <section id="cycle" className="section transformation-cycle">
            <div className="container">
                <div className="section-header text-center">
                    <h2 className="section-title">Un ciclo de evolución continua</h2>
                    <p className="section-subtitle">No un proyecto con fecha de fin.</p>
                </div>

                <div className="cycle-container">
                    <div className="cycle-tabs">
                        {steps.map((step, idx) => (
                            <button
                                key={step.id}
                                className={`cycle-tab ${idx === activeStep ? 'active' : ''}`}
                                onClick={() => setActiveStep(idx)}
                            >
                                {step.title}
                            </button>
                        ))}
                    </div>

                    <div className="cycle-content glass-panel animate-fade-in" key={activeStep}>
                        <div className="cycle-content-inner">
                            <h3 className="cycle-headline">{steps[activeStep].headline}</h3>
                            <blockquote className="cycle-quote">{steps[activeStep].quote}</blockquote>
                            <p className="cycle-desc">{steps[activeStep].description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
