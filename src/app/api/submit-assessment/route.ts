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

    // --- PAGE 1: Portada y Resumen ---
    const page1 = pdfDoc.addPage([600, 800]);
    const { width, height } = page1.getSize();

    // Header
    page1.drawRectangle({ x: 0, y: height - 120, width, height: 120, color: darkBlue });
    page1.drawText('Reporte de Diagnóstico Estratégico', { x: 40, y: height - 60, size: 22, font: fontBold, color: rgb(1, 1, 1) });
    page1.drawText('Business Transformation Orbit', { x: 40, y: height - 85, size: 14, font, color: orange });

    // Intro
    page1.drawText(`Preparado para: ${lead.name}`, { x: 40, y: height - 160, size: 12, font: fontBold, color: darkBlue });
    page1.drawText(`Empresa: ${lead.company}`, { x: 40, y: height - 180, size: 12, font, color: gray });

    const introText = "A través de nuestro modelo de evaluación continua, hemos analizado la madurez actual de su ecosistema tecnológico SAP. El objetivo central no es comercializar software, sino identificar cómo escalar el valor estratégico de TI dentro de su organización, migrando de un 'Project Mindset' tradicional hacia una evolución continua ('Continuous Value').";
    const introLines = await wrapText(introText, font, 11, 520);
    let yPos = height - 220;
    introLines.forEach(line => {
        page1.drawText(line, { x: 40, y: yPos, size: 11, font, color: gray });
        yPos -= 16;
    });

    // Score Box
    yPos -= 20;
    page1.drawRectangle({ x: 40, y: yPos - 80, width: 520, height: 80, color: lightBg, borderColor: darkBlue, borderWidth: 1 });
    page1.drawText('PUNTUACIÓN DE MADUREZ', { x: 60, y: yPos - 30, size: 10, font: fontBold, color: gray });
    page1.drawText(`${score}/18`, { x: 60, y: yPos - 60, size: 28, font: fontBold, color: orange });

    page1.drawText('Su posición en el modelo Orbit:', { x: 180, y: yPos - 30, size: 10, font: fontBold, color: gray });
    page1.drawText(analysis.level.toUpperCase(), { x: 180, y: yPos - 55, size: 16, font: fontBold, color: darkBlue });
    page1.drawText(analysis.orbita, { x: 180, y: yPos - 70, size: 12, font, color: darkBlue });

    // Analysis Desc
    yPos -= 120;
    page1.drawText('Diagnóstico de Etapa', { x: 40, y: yPos, size: 16, font: fontBold, color: darkBlue });
    yPos -= 25;
    const descLines = await wrapText(analysis.desc, font, 11, 520);
    descLines.forEach(line => {
        page1.drawText(line, { x: 40, y: yPos, size: 11, font, color: gray });
        yPos -= 16;
    });

    // Recomendaciones
    yPos -= 30;
    page1.drawText('Próximos Pasos Recomendados', { x: 40, y: yPos, size: 16, font: fontBold, color: darkBlue });
    yPos -= 30;

    for (let i = 0; i < analysis.recs.length; i++) {
        const rec = analysis.recs[i];
        const recLines = await wrapText(rec, font, 12, 480); // Adjust max width for bullet point
        page1.drawText(`${i + 1}.`, { x: 40, y: yPos, size: 12, font: fontBold, color: orange });
        let currentRecY = yPos;
        recLines.forEach((line, lineIndex) => {
            page1.drawText(line, { x: 60, y: currentRecY, size: 12, font, color: gray });
            currentRecY -= 16; // Line height for wrapped text
        });
        yPos = currentRecY - 9; // Space between recommendations
    }

    // --- PAGE 2: Metodología ---
    const page2 = pdfDoc.addPage([600, 800]);

    page2.drawText('El Modelo: Business Transformation Orbit', { x: 40, y: height - 60, size: 18, font: fontBold, color: darkBlue });

    let p2y = height - 100;
    const frameworkDesc = [
        "La mayoría de las empresas del midmarket mexicano utilizan menos del 40% de las capacidades de su ERP.",
        "Bajo una relación transaccional, TI se percibe como un centro de costos. Nuestro modelo propone el crecimiento vertical dentro de cuentas activas:",
        "",
        "Órbita 1: Core Transformation. La base estable y extensible. (S/4HANA, RISE/GROW, Clean Core).",
        "Órbita 2: Evolución Funcional. Automatización operativa con ROI claro. (E-Suite, Portales, Signavio).",
        "Órbita 3: Xtended Care Estratégico. Advisory continuo, gobierno trimestral, y evolución de negocio."
    ];

    for (const paragraph of frameworkDesc) {
        if (paragraph === "") {
            p2y -= 10;
            continue;
        }
        const lines = await wrapText(paragraph, font, 11, 520);
        for (const line of lines) {
            const isBold = line.includes('Órbita');
            page2.drawText(line, { x: 40, y: p2y, size: 11, font: isBold ? fontBold : font, color: gray });
            p2y -= 16;
        }
        p2y -= 10;
    }

    page2.drawRectangle({ x: 40, y: p2y - 100, width: 520, height: 80, color: darkBlue });
    page2.drawText('Un Momento Crítico', { x: 60, y: p2y - 45, size: 14, font: fontBold, color: rgb(1, 1, 1) });
    page2.drawText('En 2027 terminará el soporte mainstream de SAP ECC. El reloj ya está corriendo.', { x: 60, y: p2y - 65, size: 11, font, color: rgb(0.8, 0.8, 0.8) });
    page2.drawText('Es el momento ideal para evolucionar.', { x: 60, y: p2y - 80, size: 11, font, color: rgb(0.8, 0.8, 0.8) });

    // Footer en todas las páginas
    [page1, page2].forEach(page => {
        page.drawText('Xamai - SAP Gold Partner Monterrey | Modelo Xtended Care', { x: 40, y: 30, size: 9, font, color: rgb(0.6, 0.6, 0.6) });
        page.drawText('CONFIDENCIAL', { x: width - 100, y: 30, size: 9, font, color: rgb(0.6, 0.6, 0.6) });
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
