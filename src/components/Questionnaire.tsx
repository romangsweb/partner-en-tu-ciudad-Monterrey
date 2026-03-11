'use client';
import { useState } from 'react';
import './Questionnaire.css';

const businessQuestions = [
    {
        id: "b1",
        question: "¿Cuál es el principal desafío operativo y financiero de la Dirección hoy con su ERP actual?",
        options: [
            { text: "Cierres financieros lentos, reportes manuales en Excel y poca visibilidad en tiempo real para decisiones.", score: 1 },
            { text: "Tenemos datos unificados, pero nos cuesta escalar nuevos modelos de negocio o fusiones rápidamente.", score: 2 },
            { text: "Operamos con alta agilidad. El ERP soporta procesos end-to-end con analítica preventiva y en tiempo real.", score: 3 }
        ]
    },
    {
        id: "b2",
        question: "En cuanto al cumplimiento fiscal e integración B2B (proveedores, clientes), ¿cómo operan?",
        options: [
            { text: "Dependemos de procesos manuales, correos y portales externos desconectados del sistema contable principal.", score: 1 },
            { text: "Contamos con automatización parcial. Facturamos electrónicamente, pero el ciclo de compras sigue friccionado.", score: 2 },
            { text: "E-Suite 100% integrada al Core. Portales de proveedores automatizados y cumplimiento fiscal nativo y transparente.", score: 3 }
        ]
    },
    {
        id: "b3",
        question: "¿Cómo aseguran que los procesos de la empresa sean eficientes y no generen sobrecostos?",
        options: [
            { text: "Nos basamos en la intuición o reportes forenses de fin de mes cuando ya perdimos margen.", score: 1 },
            { text: "Hacemos auditorías manuales periódicas y dependemos de TI para identificar cuellos de botella obvios.", score: 2 },
            { text: "Utilizamos Minería de Procesos (ej. SAP Signavio) para analizar, medir y optimizar el flujo de valor continuamente.", score: 3 }
        ]
    },
    {
        id: "b4",
        question: "Cuando el mercado exige un cambio rápido, ¿qué tan rápido responde la arquitectura tecnológica?",
        options: [
            { text: "Muy lento. Cualquier cambio requiere meses de rediseño, altos costos e impacta el núcleo del negocio.", score: 1 },
            { text: "Regular. Compramos herramientas satélites (Shadow IT) para no tocar el ERP, fragmentando la operación.", score: 2 },
            { text: "Inmediato. Extendemos capacidades en plataformas ágiles (ej. BTP) manteniendo el Core financiero intacto.", score: 3 }
        ]
    },
    {
        id: "b5",
        question: "¿Cómo percibe el valor que aporta su partner o proveedor tecnológico principal?",
        options: [
            { text: "Es transaccional: implementan algo, cobran y desaparecen, o solo reaccionan cuando el sistema falla (bomberos).", score: 1 },
            { text: "Es un soporte técnico operativo (Service Desk) limitado a resolver tickets diarios de incidencias.", score: 2 },
            { text: "Es un Socio Estratégico (Business Advisor) que colabora con nosotros proactivamente para evolucionar el negocio.", score: 3 }
        ]
    },
    {
        id: "b6",
        question: "¿Contemplan un presupuesto y estrategia de evolución continua en la Dirección?",
        options: [
            { text: "No. Solo gastamos en tecnología cuando es una urgencia crítica o por mandatos fiscales/legales.", score: 1 },
            { text: "Tenemos un presupuesto reactivo, sabemos que debemos migrar pronto pero no hay un roadmap claro y validado.", score: 2 },
            { text: "Sí. Invertimos bajo un modelo de innovación continua (Xtended Care) con sesiones trimestrales de alineación TI-Negocio.", score: 3 }
        ]
    }
];

const technicalQuestions = [
    {
        id: "t1",
        question: "¿En qué estado se encuentra el 'Core' transaccional de su compañía (su sistema ERP primario)?",
        options: [
            { text: "Operamos en SAP ECC u otro sistema legacy; existe mucha personalización (código Z) y alta deuda técnica.", score: 1 },
            { text: "Estamos migrando o ya en S/4HANA (On-Premise/AnyPremise), pero la arquitectura guarda vicios del pasado.", score: 2 },
            { text: "Core Transformation completada bajo modelo RISE/GROW (Cloud). La base es estable, extensible y 100% Clean Core.", score: 3 }
        ]
    },
    {
        id: "t2",
        question: "¿Cómo manejan hoy las integraciones e interoperabilidad con otros sistemas del ecosistema?",
        options: [
            { text: "Punto a punto (Point-to-point) manual, desarrollos a medida complejos que se rompen con cada actualización.", score: 1 },
            { text: "Usamos middleware básico o APIs expuestas directamente, pero carecemos de un gobierno centralizado.", score: 2 },
            { text: "Arquitectura basada en eventos usando una plataforma de integración empresarial estándar (ej. SAP Integration Suite).", score: 3 }
        ]
    },
    {
        id: "t3",
        question: "¿Cómo se aborda el descubrimiento y levantamiento de requerimientos para optimizar procesos?",
        options: [
            { text: "Los usuarios levantan tickets o piden cambios funcionales en reuniones que terminan en largas actas o diagramas estáticos.", score: 1 },
            { text: "Usamos herramientas básicas de modelado cruzando datos de sistema cuando nos solicitan un proyecto formal.", score: 2 },
            { text: "Minería de procesos en sistema y minería de tareas (ej. SAP Signavio) para revelar el flujo real basado en logs de sistema.", score: 3 }
        ]
    },
    {
        id: "t4",
        question: "¿Cuál es la política arquitectónica cuando el negocio solicita modificar el comportamiento estándar?",
        options: [
            { text: "Modificamos el código nativo o llenamos de 'User Exits / BAdIs' invasivos, dificultando futuros upgrades.", score: 1 },
            { text: "Tratamos de evitarlo, pero seguimos desarrollando en ABAP clásico dentro del mismo servidor transaccional.", score: 2 },
            { text: "Clean Core estricto. Desarrollamos 'Side-by-Side Extensibility' en la plataforma BTP consumiendo APIs públicas.", score: 3 }
        ]
    },
    {
        id: "t5",
        question: "¿Qué tipo de soporte recibe la operación de TI por parte de su proveedor actual?",
        options: [
            { text: "Soporte correctivo bajo demanda. Cada incidencia es un costo adicional e impredecible.", score: 1 },
            { text: "Un contrato AMS tradicional (bolsa de horas) enfocado en estabilización pero ciego ante mejoras arquitectónicas.", score: 2 },
            { text: "Servicios Administrados Evolutivos (Xtended Care). TI cuenta con un equipo espejo que asesora en arquitectura y optimización continua.", score: 3 }
        ]
    },
    {
        id: "t6",
        question: "¿Cómo gestiona TI el ciclo de vida de aplicaciones (ALM) y el Roadmap de innovación?",
        options: [
            { text: "Es manual. Los transportes son un dolor de cabeza, y las actualizaciones (upgrades) son tratadas como proyectos críticos y riesgoso.", score: 1 },
            { text: "Hay herramientas básicas de ALM para el transporte de componentes, pero el roadmap se dicta por urgencias (top-down).", score: 2 },
            { text: "Implementación CI/CD robusta, SAP Cloud ALM integrado y pipeline orgánico de innovación alineado trimestralmente (Advisory).", score: 3 }
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
