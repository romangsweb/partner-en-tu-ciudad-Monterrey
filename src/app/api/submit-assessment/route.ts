import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456');

function getOrbitLevel(score: number, role: 'business' | 'technical') {
    if (score <= 8) {
        return {
            level: "Nivel Base",
            orbita: "Órbita 1: Core Transformation",
            desc: role === 'business' 
                ? "Baja visibilidad financiera y procesos manuales. Se recomienda una transformación centrada en finanzas ágiles y control de presupuesto mediante un Core estable como S/4HANA (RISE/GROW)." 
                : "La infraestructura guarda deuda técnica y código personalizado que pone en riesgo el cumplimiento y la operatividad. Se requiere estabilizar el Core hacia un modelo Clean Core.",
            recs: role === 'business' 
                ? ["Estabilizar la visibilidad del negocio: Migrar hacia un ERP predecible.", "Eliminar la dependencia de reportes en Excel.", "Integrar ciclos Procure-to-Pay y Order-to-Cash al sistema central."]
                : ["Auditar y eliminar deuda técnica (Código Z).", "Adoptar la práctica Clean Core y Side-by-Side extensibility.", "Implementar metodologías ágiles en lugar del monolito tradicional."]
        };
    } else if (score <= 13) {
        return {
            level: "Nivel Evolutivo",
            orbita: "Órbita 2: Evolución Funcional",
            desc: role === 'business' 
                ? "El ERP principal funciona, pero falta agilidad de mercado y digitalización en la cadena de abasto (B2B). Es momento de optimizar el ciclo de cuentas por pagar/cobrar y automatizar el cumplimiento fiscal."
                : "La base es estable, pero el gobierno de integraciones y ALM no está del todo automatizado. Se sugiere optimizar el ciclo de vida e integrar plataformas BTP o E-Suite de forma nativa.",
            recs: role === 'business' 
                ? ["Digitalizar B2B: Portales de Proveedores automatizados.", "Implementar E-Suite para Facturación y Contabilidad Electrónica sin fricciones.", "Analizar cuellos de botella con Minería de Procesos (Signavio)."]
                : ["Modernizar la integración con SAP Integration Suite (Event Driven).", "Transicionar AMS correctivo a un modelo evolutivo de optimización.", "Habilitar SAP Cloud ALM para el transporte y monitoreo."]
        };
    } else {
        return {
            level: "Nivel Estratégico",
            orbita: "Órbita 3: Xtended Care Estratégico",
            desc: role === 'business' 
                ? "Excelente madurez directiva. El ecosistema es un facilitador del modelo de negocio. El enfoque debe migrar al crecimiento predictivo a través de AI, y establecer juntas estratégicas trimestrales de valor (Advisory)."
                : "Se ha logrado la meta de un ecosistema escalable y Clean Core. El próximo paso es innovar usando BTP, SAP Analytics Cloud y gobernar la evolución bajo un framework de Advisory constante.",
            recs: role === 'business' 
                ? ["Aprovechar AI y Analítica Avanzada sobre los datos transaccionales.", "Evolucionar hacia un modelo Predictivo y de Minería de Tareas continua.", "Mantener el alineamiento TI-Negocio con sesiones ejecutivas trimestrales."]
                : ["Escalar la innovación con SAP Build / Workzone sobre BTP.", "Integrar IA generativa a procesos de usuario final.", "Mantener el ecosistema bajo el framework de servicios Extended Care."]
        };
    }
}

async function wrapText(text: string, font: any, size: number, maxWidth: number) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const width = font.widthOfTextAtSize(currentLine + ' ' + word, size);
        if (width < maxWidth) {
            currentLine += (currentLine === '' ? '' : ' ') + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

async function generatePDF(lead: any, score: number, analysis: any, role: 'business' | 'technical') {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const darkBlue = rgb(0.18, 0.22, 0.35); // Xamai primary-like
    const orange = rgb(0.96, 0.49, 0.14);   // Xamai secondary-like
    const gray = rgb(0.3, 0.3, 0.3);
    const lightBg = rgb(0.96, 0.97, 0.98);
    const accentLight = rgb(0.9, 0.94, 0.98);

    const roleName = role === 'business' ? 'Dirección y Finanzas' : 'Tecnología y Sistemas';

    // --- PAGE 1: Portada y Resumen Ejecutivo ---
    const page1 = pdfDoc.addPage([600, 800]);
    const { width, height } = page1.getSize();

    // Header Banner
    page1.drawRectangle({ x: 0, y: height - 120, width, height: 120, color: darkBlue });
    page1.drawText('DIAGNÓSTICO ESTRATÉGICO', { x: 40, y: height - 50, size: 28, font: fontBold, color: rgb(1, 1, 1) });
    page1.drawText(`Business Transformation Orbit | Perfil: ${roleName}`, { x: 40, y: height - 80, size: 14, font: fontBold, color: orange });

    // Intro Section
    page1.drawText(`Preparado en exclusiva para:`, { x: 40, y: height - 160, size: 12, font, color: gray });
    page1.drawText(`${lead.name} | ${lead.company}`, { x: 40, y: height - 180, size: 16, font: fontBold, color: darkBlue });

    // Visual Score Chart
    let yPos = height - 240;
    page1.drawRectangle({ x: 40, y: yPos - 120, width: 520, height: 120, color: lightBg, borderColor: darkBlue, borderWidth: 1 });
    page1.drawText('MADUREZ TECNOLÓGICA (ORBIT SCORE)', { x: 60, y: yPos - 30, size: 12, font: fontBold, color: darkBlue });

    // The progress bar graphic
    page1.drawRectangle({ x: 60, y: yPos - 70, width: 400, height: 20, color: rgb(0.85, 0.85, 0.85), borderColor: gray, borderWidth: 0.5 });
    const scoreWidth = (score / 18) * 400;
    page1.drawRectangle({ x: 60, y: yPos - 70, width: scoreWidth, height: 20, color: orange });

    page1.drawText(`${score} / 18 pts`, { x: 470, y: yPos - 65, size: 16, font: fontBold, color: darkBlue });

    page1.drawText('Posición actual:', { x: 60, y: yPos - 100, size: 12, font, color: gray });
    page1.drawText(analysis.level.toUpperCase(), { x: 150, y: yPos - 100, size: 14, font: fontBold, color: orange });

    // Analysis Box
    yPos -= 160;
    page1.drawRectangle({ x: 40, y: yPos - 100, width: 520, height: 90, color: accentLight });
    page1.drawText(analysis.orbita, { x: 60, y: yPos - 30, size: 14, font: fontBold, color: darkBlue });
    const descLines = await wrapText(analysis.desc, font, 11, 480);
    let descY = yPos - 50;
    descLines.forEach(line => {
        page1.drawText(line, { x: 60, y: descY, size: 11, font, color: darkBlue });
        descY -= 14;
    });

    // Actionable Insights
    yPos -= 140;
    page1.drawText(`PLAN DE ACCIÓN - PERSPECTIVA ${role === 'business' ? 'FINANCIERA' : 'TÉCNICA'}`, { x: 40, y: yPos, size: 14, font: fontBold, color: darkBlue });
    page1.drawLine({ start: { x: 40, y: yPos - 5 }, end: { x: 560, y: yPos - 5 }, thickness: 2, color: orange });
    yPos -= 30;

    for (let i = 0; i < analysis.recs.length; i++) {
        const rec = analysis.recs[i];
        const recLines = await wrapText(rec, font, 12, 480);
        page1.drawRectangle({ x: 40, y: yPos - 12 - ((recLines.length - 1) * 14), width: 15, height: 15, color: orange });
        page1.drawText(`${i + 1}`, { x: 44, y: yPos - 10 - ((recLines.length - 1) * 14), size: 12, font: fontBold, color: rgb(1, 1, 1) });
        let currentRecY = yPos - 10;
        recLines.forEach((line) => {
            page1.drawText(line, { x: 65, y: currentRecY, size: 12, font, color: gray });
            currentRecY -= 16;
        });
        yPos = currentRecY - 15;
    }


    // --- PAGE 2: Reporte Extendido del Perfil ---
    const page2 = pdfDoc.addPage([600, 800]);

    page2.drawRectangle({ x: 0, y: height - 80, width, height: 80, color: darkBlue });
    page2.drawText('ANÁLISIS DE SU PERFIL EN EL MODELO ORBIT', { x: 40, y: height - 50, size: 18, font: fontBold, color: rgb(1, 1, 1) });

    let p2y = height - 120;
    const profileIntro = role === 'business' 
        ? "El modelo Business Transformation Orbit revela cómo su infraestructura impacta el rendimiento de su capital y agilidad en el mercado. A nivel Dirección, un bajo alineamiento implica riesgos ocultos, reportes poco confiables y pérdida de competitividad frente a competidores digitalizados. Los resultados de este assessment nos permiten ver que la prioridad de su rol es asegurar el crecimiento, y para ello el ecosistema de negocio debe comportarse como un activo constante, no como un dolor de cabeza mensual."
        : "El análisis técnico de este assessment se centra en la escalabilidad, deuda técnica y gobernanza bajo el concepto de Clean Core. A nivel arquitectura de sistemas en Monterrey o México, el gran reto es mantener componentes aislados de la lógica central, facilitar la gestión del ciclo de vida (ALM) con un uptime continuo. Como líder de TI, usted comprende que el estancamiento (o las malas personalizaciones) pueden dejar a la empresa ciega frente al cambio del mercado y encadenada a un mantenimiento costoso del ERP.";

    const profileIntroLines = await wrapText(profileIntro, font, 12, 520);
    for (const line of profileIntroLines) {
        page2.drawText(line, { x: 40, y: p2y, size: 12, font, color: gray });
        p2y -= 18;
    }

    p2y -= 30;
    
    // Insert The Advisory Framework explanation specific to Monterrey
    page2.drawText('EL MODELO DE EVOLUCIÓN PARA MONTERREY', { x: 40, y: p2y, size: 14, font: fontBold, color: darkBlue });
    page2.drawLine({ start: { x: 40, y: p2y - 5 }, end: { x: 560, y: p2y - 5 }, thickness: 2, color: orange });
    p2y -= 25;

    const frameworkDesc = [
        "En 2027 termina el soporte mainstream para SAP ECC. Una gran parte del midmarket en México sabe esto, pero pocos tienen claro el costo estructurado y la hoja de ruta real de adaptación.",
        "",
        "Cambiar a S/4HANA (Órbita 1) no es suficiente. El valor real está en migrar de un 'Project Mindset' tradicional a un modelo de Advisory Continuo (Órbita 3), impulsado por la digitalización de la cadena B2B (E-Suite) y plataformas de inteligencia (BTP, Signavio).",
        "",
        "Para lograrlo, la metodología Xtended Care propuesta por Xamai no enfoca los esfuerzos en un soporte correctivo que se extingue, sino en ser un espejo de su estrategia de negocio, asegurando validaciones de valor continuas, con base técnica sostenible (Clean Core)."
    ];

    for (const paragraph of frameworkDesc) {
        if (paragraph === "") {
            p2y -= 10;
            continue;
        }
        const lines = await wrapText(paragraph, font, 11, 520);
        for (const line of lines) {
            page2.drawText(line, { x: 40, y: p2y, size: 11, font, color: gray });
            p2y -= 18;
        }
        p2y -= 10;
    }

    // Massive CTA SECTION
    p2y -= 40;
    page2.drawRectangle({ x: 40, y: p2y - 180, width: 520, height: 160, color: orange, borderColor: darkBlue, borderWidth: 2 });
    page2.drawText('¿Qué sigue ahora?', { x: 230, y: p2y - 40, size: 18, font: fontBold, color: rgb(1, 1, 1) });

    const ctaDesc = `Comprendemos que cada ecosistema es único y los desafíos del perfil de ${roleName} requieren precisión. Agende una sesión estratégica de 45 minutos (sin costo) con nuestro equipo de Advisory en Monterrey. En esta llamada cruzaremos su puntuación con su arquitectura o métricas de negocio para trazar una hoja de ruta 100% personalizada.`;
    const ctaLines = await wrapText(ctaDesc, font, 12, 460);
    let ctaYDesc = p2y - 80;
    for (const line of ctaLines) {
        page2.drawText(line, { x: 70, y: ctaYDesc, size: 12, font, color: rgb(1, 1, 1) });
        ctaYDesc -= 18;
    }

    // Button Graphic
    page2.drawRectangle({ x: 200, y: p2y - 150, width: 200, height: 40, color: darkBlue, borderColor: rgb(1, 1, 1), borderWidth: 2 });
    page2.drawText('HABLEMOS DE NEGOCIOS', { x: 220, y: p2y - 135, size: 12, font: fontBold, color: rgb(1, 1, 1) });

    // Footer
    [page1, page2].forEach(page => {
        page.drawText('Xamai - SAP Gold Partner Monterrey | Modelo Xtended Care', { x: 40, y: 30, size: 9, font: fontBold, color: gray });
        page.drawText('CONFIDENCIAL', { x: width - 100, y: 30, size: 9, font: fontBold, color: gray });
    });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
}

export async function POST(request: Request) {
    try {
        const { lead, answers, score, role } = await request.json();
        
        // Default to business if somehow role is missing on legacy submissions
        const safeRole = role || 'business';
        const analysis = getOrbitLevel(score, safeRole);

        // 1. Send Slack Notification
        if (process.env.SLACK_WEBHOOK_URL) {
            try {
                await fetch(process.env.SLACK_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        text: `*Nuevo Lead Assessment Orbit* 🚀\n*Nombre:* ${lead.name}\n*Empresa:* ${lead.company}\n*Correo:* ${lead.email}\n*Rol:* ${safeRole}\n*Puntuación:* ${score}/18 (${analysis.level})`
                    })
                });
            } catch (slackError) {
                console.error('Slack Webhook Error:', slackError);
            }
        }

        // 2. Generate PDF
        let pdfBuffer;
        try {
            pdfBuffer = await generatePDF(lead, score, analysis, safeRole);
        } catch (pdfError) {
            console.error('PDF Generation Error:', pdfError);
            return NextResponse.json({ error: 'Error al generar el reporte PDF' }, { status: 500 });
        }

        // 3. Send Email with Resend
        if (process.env.RESEND_API_KEY) {
            try {
                const emailResponse = await resend.emails.send({
                    from: 'Xamai Assessment <contacto@xamai.com>',
                    to: lead.email,
                    subject: 'Tu Reporte de Transformación Empresarial (Business Transformation Orbit)',
                    html: `
            <h2>Hola ${lead.name},</h2>
            <p>Gracias por realizar nuestro diagnóstico de Business Transformation Orbit.</p>
            <p>De acuerdo con tus respuestas, tu empresa se encuentra en el <strong>${analysis.level}</strong>.</p>
            <p>Hemos adjuntado tu reporte ejecutivo en PDF. Nos pondremos en contacto contigo pronto para platicar cómo podemos ayudarte a acelerar tu arquitectura tecnológica.</p>
            <br/>
            <p>Saludos,</p>
            <p><strong>El Equipo de Xamai Monterrey</strong></p>
          `,
                    attachments: [
                        {
                            filename: 'Reporte_Transformacion_Xamai.pdf',
                            content: pdfBuffer,
                        }
                    ]
                });
                console.log("Resend API called for", lead.email, emailResponse);
            } catch (emailError) {
                console.error('Resend Error:', emailError);
            }
        }

        const pdfBase64 = pdfBuffer.toString('base64');
        return NextResponse.json({ success: true, analysis, pdfBase64 });

    } catch (error) {
        console.error('Submission Error:', error);
        return NextResponse.json({ error: 'Error procesando la solicitud' }, { status: 500 });
    }
}
