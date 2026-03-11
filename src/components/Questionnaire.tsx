'use client';
import { useState } from 'react';
import './Questionnaire.css';

const businessQuestions = [
    {
        id: "b1",
        question: "¿Cuál es el principal desafío operativo y financiero con su ERP actual?",
        options: [
            { text: "Cierres financieros lentos, reportes manuales en Excel y poca visibilidad en tiempo real.", score: 1 },
            { text: "Tenemos datos unificados, pero el sistema es rígido para escalar y adaptar nuevos modelos de negocio.", score: 2 },
            { text: "Operamos con agilidad total. El ERP soporta procesos end-to-end con analítica predictiva en tiempo real.", score: 3 }
        ]
    },
    {
        id: "b2",
        question: "Ante un cambio rápido exigido por el mercado, ¿qué tan ágil es su respuesta tecnológica?",
        options: [
            { text: "Muy lenta. Cualquier cambio al sistema requiere meses, altos costos y detiene la innovación.", score: 1 },
            { text: "Regular. Compramos plataformas satélite desconectadas para evitar modificar el ERP central.", score: 2 },
            { text: "Inmediata. Extendemos capacidades en plataformas ágiles (ej. BTP) manteniendo el Core intacto.", score: 3 }
        ]
    },
    {
        id: "b3",
        question: "¿Cómo aseguran la eficiencia de procesos B2B (proveedores, clientes) y el cumplimiento?",
        options: [
            { text: "Dependemos de procesos manuales, facturación fuera del sistema y portales desconectados.", score: 1 },
            { text: "Contamos con automatización parcial, pero el ciclo de compras y cuentas por pagar reporta fricciones.", score: 2 },
            { text: "Portales B2B automatizados, E-invoicing nativo y minería de procesos (procesos optimizados).", score: 3 }
        ]
    },
    {
        id: "b4",
        question: "¿Cuál es su estrategia de inversión TI y el nivel de aporte de su proveedor actual?",
        options: [
            { text: "Presupuesto puramente reactivo. Nuestro proveedor es transaccional y solo atiende urgencias.", score: 1 },
            { text: "Invertimos por necesidad de modernización; el proveedor da soporte técnico tradicional (bolsa de horas).", score: 2 },
            { text: "Inversión proactiva en innovación. Nuestro proveedor es un Socio Estratégico que impulsa la evolución corporativa.", score: 3 }
        ]
    }
];

const technicalQuestions = [
    {
        id: "t1",
        question: "¿En qué estado se encuentra el 'Core' transaccional de su compañía (ERP)?",
        options: [
            { text: "Operamos en SAP ECC o legacy; con exceso de personalización (código Z) y alta deuda técnica.", score: 1 },
            { text: "Migrando o en S/4HANA (On-Premise), pero la arquitectura aún conserva desarrollos invasivos del pasado.", score: 2 },
            { text: "Core Transformation en Cloud (RISE/GROW). Infraestructura estable y 100% Clean Core.", score: 3 }
        ]
    },
    {
        id: "t2",
        question: "¿Cuál es la política arquitectónica cuando el negocio solicita una funcionalidad a la medida?",
        options: [
            { text: "Modificamos el código nativo (User Exits/BAdIs), lo cual dificulta y retrasa futuras actualizaciones.", score: 1 },
            { text: "Desarrollamos soluciones personalizadas (ABAP) pero alojadas en el mismo servidor transaccional.", score: 2 },
            { text: "Clean Core estricto. Se construye 'Side-by-Side Extensibility' en la plataforma BTP consumiendo APIs públicas.", score: 3 }
        ]
    },
    {
        id: "t3",
        question: "¿Cómo gobiernan y manejan las integraciones con el resto del ecosistema de aplicaciones?",
        options: [
            { text: "A través de conexiones punto a punto manuales que son inestables y se rompen frecuentemente.", score: 1 },
            { text: "Usamos middleware básico o exponemos APIs sin un catálogo unificado ni métricas de uso.", score: 2 },
            { text: "Arquitectura moderna orientada a eventos con una plataforma empresarial estándar (ej. SAP Integration Suite).", score: 3 }
        ]
    },
    {
        id: "t4",
        question: "¿Qué modelo rige la gestión del ciclo de vida de aplicaciones (ALM) y el soporte?",
        options: [
            { text: "Operación de alto riesgo en transportes. Soporte correctivo donde cada incidencia genera sobrecostos.", score: 1 },
            { text: "ALM básico para transportes y un contrato AMS tradicional enfocado únicamente en estabilizar el sistema.", score: 2 },
            { text: "Pipeline CI/CD (SAP Cloud ALM) alineado a Servicios Administrados Evolutivos (Advisory continuo).", score: 3 }
        ]
    }
];

export default function Questionnaire() {
    const [step, setStep] = useState(-1); // -1 is the role selection step
    const [role, setRole] = useState<'business' | 'technical' | null>(null);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [lead, setLead] = useState({ name: '', company: '', email: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [assessmentResult, setAssessmentResult] = useState<any>(null);
    const [pdfBase64, setPdfBase64] = useState<string | null>(null);
    const [error, setError] = useState('');

    const handleRoleSelect = (selectedRole: 'business' | 'technical') => {
        setRole(selectedRole);
        setStep(0);
    };

    const handleOptionSelect = (qId: string, score: number) => {
        setAnswers(prev => ({ ...prev, [qId]: score }));
    };

    const currentQuestions = role === 'business' ? businessQuestions : technicalQuestions;

    const handleNext = () => {
        if (step > -1 && step < currentQuestions.length && !answers[currentQuestions[step].id]) {
            setError('Por favor, selecciona una opción para continuar.');
            return;
        }
        setError('');
        setStep(prev => prev + 1);
    };

    const calculateScore = () => {
        return Object.values(answers).reduce((acc, curr) => acc + curr, 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        const totalScore = calculateScore();

        try {
            const response = await fetch('/api/submit-assessment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lead,
                    answers,
                    score: totalScore,
                    role
                })
            });

            if (!response.ok) {
                throw new Error('Ocurrió un error al procesar la solicitud.');
            }

            const data = await response.json();
            setAssessmentResult(data.analysis);
            setPdfBase64(data.pdfBase64);
            setIsSuccess(true);
        } catch (err) {
            setError('Error al enviar el formulario. Por favor intenta de nuevo.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDownloadPDF = () => {
        if (!pdfBase64) return;
        const link = document.createElement('a');
        link.href = `data:application/pdf;base64,${pdfBase64}`;
        link.download = `Reporte_Transformacion_Xamai.pdf`;
        link.click();
    };

    if (isSuccess && assessmentResult) {
        const orbitNumber = assessmentResult.orbita.includes("1") ? 1 : assessmentResult.orbita.includes("2") ? 2 : 3;

        return (
            <div className="q-container glass-panel text-center results-view animate-fade-in">
                <div className="results-header">
                    <h2>Tu Diagnóstico Está Listo</h2>
                    <p className="results-subtitle">Hemos analizado las respuestas y tu reporte detallado está en tu correo.</p>
                </div>

                <div className="orbit-graphic-container">
                    <div className={`orbit-graphic orbit-level-${orbitNumber}`}>
                        <div className="orbit-circle orbit-outer"></div>
                        <div className="orbit-circle orbit-middle"></div>
                        <div className="orbit-circle orbit-inner"></div>
                        <div className="orbit-center">
                            <span className="orbit-level-text">Órbita {orbitNumber}</span>
                        </div>
                    </div>
                </div>

                <div className="results-analysis">
                    <span className="results-badge">{assessmentResult.level}</span>
                    <h3 className="results-orbit-title">{assessmentResult.orbita}</h3>
                    <p className="results-desc">{assessmentResult.desc}</p>
                </div>

                <div className="results-actions">
                    <div className="cta-box primary-cta">
                        <h4>¿Qué sigue ahora?</h4>
                        <p>Agenda una Sesión Estratégica de 45 min (sin costo) con nuestro equipo de Advisory para trazar tu hoja de ruta hacia la transformación.</p>
                        <a href="https://calendly.com/" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg pulse-animation mt-2 inline-block">
                            Agendar Sesión de Advisory
                        </a>
                    </div>
                    
                    <div className="cta-box secondary-cta">
                        <p className="text-sm text-gray-400 mb-2">También puedes descargar tu reporte en este momento:</p>
                        <button onClick={handleDownloadPDF} className="btn btn-outline" disabled={!pdfBase64}>
                            Descargar Reporte PDF
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="q-container glass-panel animate-fade-in">
            {step > -1 && (
                <div className="q-progress">
                    <div
                        className="q-progress-bar"
                        style={{ width: `${(step / (currentQuestions.length)) * 100}%` }}
                    ></div>
                </div>
            )}

            {step === -1 ? (
                <div className="q-step">
                    <span className="q-badge">Paso Preliminar</span>
                    <h2 className="q-title">Selecciona tu Perfil</h2>
                    <p className="q-desc">Para brindarte un diagnóstico preciso, cuéntanos desde qué óptica evaluaremos el negocio.</p>

                    <div className="q-options">
                        <button
                            className="q-option"
                            onClick={() => handleRoleSelect('business')}
                        >
                            <strong>Dirección / Finanzas</strong>
                            <div className="text-sm mt-2 text-gray-500">Ej. CEO, CFO, Director General, Operaciones.</div>
                        </button>
                        <button
                            className="q-option"
                            onClick={() => handleRoleSelect('technical')}
                        >
                            <strong>Tecnología / Sistemas</strong>
                            <div className="text-sm mt-2 text-gray-500">Ej. CIO, Gerente de TI, Arquitecto de Sistemas.</div>
                        </button>
                    </div>
                </div>
            ) : step < currentQuestions.length ? (
                <div className="q-step">
                    <span className="q-badge">Pregunta {step + 1} de {currentQuestions.length}</span>
                    <h2 className="q-title">{currentQuestions[step].question}</h2>

                    <div className="q-options">
                        {currentQuestions[step].options.map((opt, idx) => (
                            <button
                                key={idx}
                                className={`q-option ${answers[currentQuestions[step].id] === opt.score ? 'selected' : ''}`}
                                onClick={() => handleOptionSelect(currentQuestions[step].id, opt.score)}
                            >
                                {opt.text}
                            </button>
                        ))}
                    </div>

                    {error && <p className="q-error">{error}</p>}

                    <div className="q-actions">
                        <button
                            className="btn btn-primary"
                            onClick={handleNext}
                            disabled={!answers[currentQuestions[step].id]}
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            ) : (
                <div className="q-step">
                    <span className="q-badge">Último paso</span>
                    <h2 className="q-title">Descubre tu Diagnóstico</h2>
                    <p className="q-desc">Déjanos tus datos para procesar tu calificación y enviarte de inmediato el reporte ejecutivo en PDF basado en el modelo Orbit.</p>

                    <form className="q-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Nombre Completo</label>
                            <input
                                type="text"
                                required
                                value={lead.name}
                                onChange={e => setLead({ ...lead, name: e.target.value })}
                                placeholder="Ej. María González"
                            />
                        </div>
                        <div className="form-group">
                            <label>Empresa</label>
                            <input
                                type="text"
                                required
                                value={lead.company}
                                onChange={e => setLead({ ...lead, company: e.target.value })}
                                placeholder="Ej. Industrias Monterrey"
                            />
                        </div>
                        <div className="form-group">
                            <label>Correo Electrónico Corporativo</label>
                            <input
                                type="email"
                                required
                                value={lead.email}
                                onChange={e => setLead({ ...lead, email: e.target.value })}
                                placeholder="maria@empresa.com"
                            />
                        </div>

                        {error && <p className="q-error">{error}</p>}

                        <button type="submit" className="btn btn-primary submit-btn" disabled={isSubmitting}>
                            {isSubmitting ? 'Procesando...' : 'Obtener mi Diagnóstico PDF'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
