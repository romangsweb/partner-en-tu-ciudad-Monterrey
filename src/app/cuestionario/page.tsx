import Questionnaire from '@/components/Questionnaire';
import Header from '@/components/Header';

export const metadata = {
    title: 'Diagnóstico de Transformación | SAP Monterrey',
    description: 'Descubre en qué momento está tu empresa y obtén tu reporte personalizado basado en el modelo Business Transformation Orbit.',
};

export default function QuestionnairePage() {
    return (
        <>
            <Header />
            <main className="min-h-screen pt-[120px] pb-16 px-4 bg-[var(--color-surface-50)]">
                <div className="container text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-[var(--color-primary)] mb-4">Assessment de Evolución</h1>
                    <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
                        Evalúa la madurez técnica y estratégica de tu empresa en Monterrey a través de estas 4 preguntas clave. Recibirás de inmediato un reporte ejecutivo.
                    </p>
                </div>

                <Questionnaire />
            </main>
        </>
    );
}
