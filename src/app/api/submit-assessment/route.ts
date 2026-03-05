import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456');

function getOrbitLevel(score: number) {
    if (score <= 8) {
        return {
            level: "Nivel Base",
            orbita: "Órbita 1: Core Transformation",
            desc: "Su empresa requiere consolidar la plataforma técnica (Migración a S/4HANA o adopción de Clean Core). Existe deuda técnica acumulada que impide el crecimiento. Se recomienda un Digital Genesis Assessment.",
            recs: [
                "Estabilizar el Core: Migración hacia S/4HANA (RISE/GROW).",
                "Adoptar una mentalidad 'Clean Core' para eliminar deuda técnica.",
                "Implementar metodología ágil orientada a la validación de negocio."
            ]
        };
    } else if (score <= 13) {
        return {
            level: "Nivel Evolutivo",
            orbita: "Órbita 2: Evolución Funcional",
            desc: "Tiene una base estable pero persisten desconexiones o fricción operativa. Es el momento ideal para implementar automatizaciones como E-Suite, Portal Proveedores o Business Data Cloud para tener visibilidad integrada.",
            recs: [
                "Automatización B2B: Implementación de E-Suite (Factura-E, Conta-E).",
                "Digitalizar la cadena de abasto con Portal de Proveedores.",
                "Minería de procesos: Identificar cuellos de botella mediante SAP Signavio."
            ]
        };
    } else {
        return {
            level: "Nivel Estratégico",
            orbita: "Órbita 3: Xtended Care Estratégico",
            desc: "Excelente madurez. Su tecnología está alineada al negocio. El reto ahora es mantener una arquitectura viva con inteligencia (SAP Signavio, BTP) operando bajo un modelo de advisory continuo.",
            recs: [
                "Establecer un Gobierno Trimestral estratégico entre TI y Dirección.",
                "Generar un 'Roadmap Vivo' de evolución tecnológica.",
                "Transicionar de un soporte transaccional a un modelo de Advisory Continuo (Xtended Care)."
            ]
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

async function generatePDF(lead: any, score: number, analysis: any) {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const darkBlue = rgb(0.18, 0.22, 0.35); // Xamai primary-like
    const orange = rgb(0.96, 0.49, 0.14);   // Xamai secondary-like
    const gray = rgb(0.3, 0.3, 0.3);
    const lightBg = rgb(0.96, 0.97, 0.98);
    const accentLight = rgb(0.9, 0.94, 0.98);

    // --- PAGE 1: Portada y Resumen ---
    const page1 = pdfDoc.addPage([600, 800]);
    const { width, height } = page1.getSize();

    // Header Banner
    page1.drawRectangle({ x: 0, y: height - 120, width, height: 120, color: darkBlue });
    page1.drawText('DIAGNÓSTICO ESTRATÉGICO', { x: 40, y: height - 50, size: 28, font: fontBold, color: rgb(1, 1, 1) });
    page1.drawText('Business Transformation Orbit', { x: 40, y: height - 80, size: 16, font, color: orange });

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
    page1.drawRectangle({ x: 40, y: yPos - 90, width: 520, height: 80, color: accentLight });
    page1.drawText(analysis.orbita, { x: 60, y: yPos - 30, size: 14, font: fontBold, color: darkBlue });
    const descLines = await wrapText(analysis.desc, font, 11, 480);
    let descY = yPos - 50;
    descLines.forEach(line => {
        page1.drawText(line, { x: 60, y: descY, size: 11, font, color: darkBlue });
        descY -= 14;
    });

    // Actionable Insights
    yPos -= 130;
    page1.drawText('PLAN DE ACCIÓN RECOMENDADO', { x: 40, y: yPos, size: 14, font: fontBold, color: darkBlue });
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

    // --- PAGE 2: Metodología y CTA ---
    const page2 = pdfDoc.addPage([600, 800]);

    page2.drawRectangle({ x: 0, y: height - 80, width, height: 80, color: darkBlue });
    page2.drawText('HACIA LA EVOLUCIÓN CONTINUA', { x: 40, y: height - 50, size: 18, font: fontBold, color: rgb(1, 1, 1) });

    let p2y = height - 120;
    const frameworkDesc = [
        "En 2027 termina el soporte mainstream para SAP ECC. Una gran parte del midmarket en México sabe esto, pero pocos tienen claro el costo estructurado y la hoja de ruta real de adaptación.",
        "",
        "Cambiar a S/4HANA (Órbita 1) no es suficiente. El valor real está en migrar de un 'Project Mindset' tradicional a un modelo de Advisory Continuo (Órbita 3), impulsado por la digitalización de la cadena B2B (E-Suite) y plataformas de inteligencia (BTP, Signavio).",
    ];

    for (const paragraph of frameworkDesc) {
        if (paragraph === "") {
            p2y -= 10;
            continue;
        }
        const lines = await wrapText(paragraph, font, 12, 520);
        for (const line of lines) {
            page2.drawText(line, { x: 40, y: p2y, size: 12, font, color: gray });
            p2y -= 18;
        }
        p2y -= 10;
    }

    // Massive CTA SECTION
    p2y -= 40;
    page2.drawRectangle({ x: 40, y: p2y - 180, width: 520, height: 160, color: orange, borderColor: darkBlue, borderWidth: 2 });
    page2.drawText('¿Qué sigue ahora?', { x: 230, y: p2y - 40, size: 18, font: fontBold, color: rgb(1, 1, 1) });

    const ctaDesc = "Comprendemos que cada ecosistema es único. Agende una sesión estratégica de 45 minutos (sin costo) con nuestro equipo de Advisory en Monterrey. En esta llamada cruzaremos su puntuación con su arquitectura actual para trazar una hoja de ruta 100% personalizada.";
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
        const { lead, answers, score } = await request.json();
        const analysis = getOrbitLevel(score);

        // 1. Send Slack Notification
        if (process.env.SLACK_WEBHOOK_URL) {
            try {
                await fetch(process.env.SLACK_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        text: `*Nuevo Lead Assessment Orbit* 🚀\n*Nombre:* ${lead.name}\n*Empresa:* ${lead.company}\n*Correo:* ${lead.email}\n*Puntuación:* ${score}/18 (${analysis.level})`
                    })
                });
            } catch (slackError) {
                console.error('Slack Webhook Error:', slackError);
            }
        }

        // 2. Generate PDF
        let pdfBuffer;
        try {
            pdfBuffer = await generatePDF(lead, score, analysis);
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

        return NextResponse.json({ success: true, analysis });

    } catch (error) {
        console.error('Submission Error:', error);
        return NextResponse.json({ error: 'Error procesando la solicitud' }, { status: 500 });
    }
}
