'use client';
import { useState } from 'react';
import './Questionnaire.css';

const questions = [
    {
        id: 1,
        question: "¿En qué estado se encuentra el 'Core' transaccional de su compañía (su sistema ERP primario)?",
        options: [
            { text: "Operamos en SAP ECC u otro sistema antiguo; existe mucha personalización (código Z) y deuda técnica.", score: 1 },
            { text: "Estamos migrando o operamos en S/4HANA, pero la arquitectura no es completamente Clean Core.", score: 2 },
            { text: "Core Transformation completada bajo el estándar RISE/GROW. La base es estable, extensible y Clean Core.", score: 3 }
        ]
    },
    {
        id: 2,
        question: "Respecto a la digitalización del B2B y cumplimiento fiscal, ¿qué capacidades están activas?",
        options: [
            { text: "Seguimos dependiendo de portales manuales o correos para facturación y proveedores.", score: 1 },
            { text: "Tenemos un nivel intermedio de automatización pero aún no está completamente integrado al Core.", score: 2 },
            { text: "Contamos con E-Suite integrada (Factura-E, Conta-E) y un Portal de Proveedores automatizado.", score: 3 }
        ]
    },
    {
        id: 3,
        question: "¿Cómo gestionan la inteligencia y la minería de procesos organizacionales?",
        options: [
            { text: "No medimos activamente si el sistema se usa de forma correcta.", score: 1 },
            { text: "Obtenemos reportes de TI cuando hay cuellos de botella obvios.", score: 2 },
            { text: "Utilizamos SAP Signavio para analizar, diseñar y optimizar procesos en función del valor de negocio.", score: 3 }
        ]
    },
    {
        id: 4,
        question: "¿Cuál es el enfoque de la Dirección cuando requiere nuevas características tecnológicas?",
        options: [
            { text: "Piden alterar el ERP principal, aumentando la complejidad y los costos de mantenimiento futuro.", score: 1 },
            { text: "Buscan herramientas aisladas de terceros para resolver problemas específicos (Shadow IT).", score: 2 },
            { text: "Desarrollan aplicaciones nativas o integraciones en la Business Technology Platform (BTP).", score: 3 }
        ]
    },
    {
        id: 5,
        question: "¿Con qué nivel de profundidad trabajan con su partner tecnológico actual?",
        options: [
            { text: "Transaccional: Project Mindset (implementan, cobran y se van) o actúan de bomberos reactivos.", score: 1 },
            { text: "Proveedor técnico: AMS parcial enfocado a corrección de incidencias (Service Desk).", score: 2 },
            { text: "Estratégico: Actúan como un Business Advisor con participación de la Dirección, buscando evolución.", score: 3 }
        ]
    },
    {
        id: 6,
        question: "¿Poseen un Roadmap Vivo de evolución tecnológica y un gobierno sobre las iniciativas?",
        options: [
            { text: "No. Solo ejecutamos lo estrictamente urgente o dictado por regulaciones.", score: 1 },
            { text: "Tenemos un plan general, pero no hay reuniones estructurales formalizadas y métricas de avance.", score: 2 },
            { text: "Sí, operamos bajo Xtended Care con sesiones estratégicas trimestrales y un pipeline orgánico validado.", score: 3 }
        ]
    }
];

export default function Questionnaire() {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [lead, setLead] = useState({ name: '', company: '', email: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleOptionSelect = (qId: number, score: number) => {
        setAnswers(prev => ({ ...prev, [qId]: score }));
    };

    const handleNext = () => {
        if (step < questions.length && !answers[questions[step].id]) {
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
                    score: totalScore
                })
            });

            if (!response.ok) {
                throw new Error('Ocurrió un error al procesar la solicitud.');
            }

            setIsSuccess(true);
        } catch (err) {
            setError('Error al enviar el formulario. Por favor intenta de nuevo.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="q-container glass-panel text-center success-view animate-fade-in">
                <h2>¡Diagnóstico Completado!</h2>
                <p>Hemos procesado tus respuestas y calculado tu posición en el modelo Business Transformation Orbit.</p>
                <p>En unos minutos recibirás un correo electrónico con tu reporte en PDF detallado y los siguientes pasos recomendados.</p>
                <a href="/" className="btn btn-primary mt-4">Regresar al Inicio</a>
            </div>
        );
    }

    return (
        <div className="q-container glass-panel animate-fade-in">
            <div className="q-progress">
                <div
                    className="q-progress-bar"
                    style={{ width: `${(step / (questions.length)) * 100}%` }}
                ></div>
            </div>

            {step < questions.length ? (
                <div className="q-step">
                    <span className="q-badge">Pregunta {step + 1} de {questions.length}</span>
                    <h2 className="q-title">{questions[step].question}</h2>

                    <div className="q-options">
                        {questions[step].options.map((opt, idx) => (
                            <button
                                key={idx}
                                className={`q-option ${answers[questions[step].id] === opt.score ? 'selected' : ''}`}
                                onClick={() => handleOptionSelect(questions[step].id, opt.score)}
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
                            disabled={!answers[questions[step].id]}
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
