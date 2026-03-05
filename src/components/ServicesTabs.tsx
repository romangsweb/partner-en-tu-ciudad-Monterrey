'use client';
import { useState } from 'react';
import './ServicesTabs.css';

const services = [
    {
        key: "diagnostico",
        label: "Diagnóstico",
        title: "SAP Evolution & Digital Genesis",
        points: [
            "SAP Evolution Assessment para ecosistemas ECC existentes.",
            "Digital Genesis Assessment para nuevos proyectos tecnológicos.",
            "Identificación clara de fricciones operativas."
        ]
    },
    {
        key: "arquitectura",
        label: "Arquitectura",
        title: "Diseño para el futuro",
        points: [
            "Estrategia Clean Core garantizada.",
            "MigNow: Herramienta de IA para migración.",
            "Optimización de costos a largo plazo."
        ]
    },
    {
        key: "implementacion",
        label: "Implementación",
        title: "Ejecución Ágil",
        points: [
            "SAP S/4HANA Modelo a Medida para procesos complejos.",
            "Modelo Acelerado RISE with SAP (Estándar).",
            "Integración enfocada en industrias (manufactura, logística)."
        ]
    },
    {
        key: "evolucion",
        label: "Evolución Continua",
        title: "Xtended Care Management",
        points: [
            "Operate: Mantenimiento y prevención constante.",
            "Evolve: Mejoras incrementales basadas en KPIs.",
            "Innovate: Integración de nuevas tecnologías SAP."
        ]
    },
    {
        key: "ecosistema",
        label: "Ecosistema",
        title: "BTP, Signavio y E-Suite",
        points: [
            "E-Suite: Localización fiscal para México (Factura-E, Conta-E).",
            "SAP Signavio para minería de procesos.",
            "Business Data Cloud & SAP SuccessFactors."
        ]
    }
];

export default function ServicesTabs() {
    const [activeTab, setActiveTab] = useState(services[0].key);

    const activeService = services.find(s => s.key === activeTab);

    return (
        <section id="services" className="section services-tabs">
            <div className="container">
                <div className="section-header text-center">
                    <h2 className="section-title">Lo que hacemos — y cuándo tiene sentido</h2>
                    <p className="section-subtitle">Aceleradores y servicios organizados para aportar valor en cada etapa.</p>
                </div>

                <div className="tabs-wrapper">
                    <div className="tabs-header">
                        {services.map((service) => (
                            <button
                                key={service.key}
                                className={`tab-btn ${activeTab === service.key ? 'active' : ''}`}
                                onClick={() => setActiveTab(service.key)}
                            >
                                {service.label}
                            </button>
                        ))}
                    </div>

                    <div className="tab-content glass-panel animate-fade-in" key={activeTab}>
                        {activeService && (
                            <div className="grid grid-2">
                                <div className="tab-text">
                                    <h3>{activeService.title}</h3>
                                    <ul className="service-list">
                                        {activeService.points.map((pt, i) => (
                                            <li key={i}>{pt}</li>
                                        ))}
                                    </ul>
                                    <a href="#contacto" className="btn btn-primary mt-4">Solicitar información</a>
                                </div>
                                <div className="tab-visual">
                                    <div className="visual-placeholder">Xamai SAP Monterrey</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
