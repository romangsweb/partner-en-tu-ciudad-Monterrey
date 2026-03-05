import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456');

function getOrbitLevel(score: number) {
    if (score <= 8) {
        return {
            level: "Nivel Base",
            orbita: "Órbita 1: Core Transformation",
            desc: "Su empresa requiere consolidar la plataforma técnica (Migración a S/4HANA o adopción de Clean Core). Existe deuda técnica acumulada que impide el crecimiento. Se recomienda un Digital Genesis Assessment."
        };
    } else if (score <= 13) {
        return {
            level: "Nivel Evolutivo",
            orbita: "Órbita 2: Evolución Funcional",
            desc: "Tiene una base estable pero persisten desconexiones o fricción operativa. Es el momento ideal para implementar automatizaciones como E-Suite, Portal Proveedores o Business Data Cloud para tener visibilidad integrada."
        };
    } else {
        return {
            level: "Nivel Estratégico",
            orbita: "Órbita 3: Xtended Care Estratégico",
            desc: "Excelente madurez. Su tecnología está alineada al negocio. El reto ahora es mantener una arquitectura viva con inteligencia (SAP Signavio, BTP) operando bajo un modelo de advisory continuo."
        };
    }
}

async function generatePDF(lead: any, score: number, analysis: any) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Colors
    const darkBlue = rgb(0.04, 0.14, 0.25);
    const orange = rgb(1, 0.35, 0);
    const gray = rgb(0.4, 0.45, 0.54);

    // Header Background
    page.drawRectangle({
        x: 0,
        y: height - 120,
        width,
        height: 120,
        color: darkBlue
    });

    // Title
    page.drawText('Reporte de Transformación Empresarial (SAP Monterrey)', {
        x: 40,
        y: height - 60,
        size: 18,
        font: fontBold,
        color: rgb(1, 1, 1)
    });

    page.drawText(`Preparado para: ${lead.name} (${lead.company})`, {
        x: 40,
        y: height - 90,
        size: 12,
        font: font,
        color: rgb(1, 1, 1)
    });

    // Score
    page.drawText('Puntuación de Madurez Técnica', {
        x: 40,
        y: height - 180,
        size: 16,
        font: fontBold,
        color: darkBlue
    });

    page.drawText(`${score}/18 Puntos`, {
        x: 40,
        y: height - 210,
        size: 24,
        font: fontBold,
        color: orange
    });

    // Analysis Result
    page.drawText('Diagnóstico: ' + analysis.level, {
        x: 40,
        y: height - 270,
        size: 14,
        font: fontBold,
        color: darkBlue
    });

    page.drawText('Fase Recomendada: ' + analysis.orbita, {
        x: 40,
        y: height - 300,
        size: 12,
        font: fontBold,
        color: gray
    });

    // Description with word-wrap (simple implementation)
    const words = analysis.desc.split(' ');
    let line = '';
    let y = height - 340;
    for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const textWidth = font.widthOfTextAtSize(testLine, 12);
        if (textWidth > 500 && i > 0) {
            page.drawText(line, { x: 40, y, size: 12, font, color: gray });
            line = words[i] + ' ';
            y -= 20;
        } else {
            line = testLine;
        }
    }
    page.drawText(line, { x: 40, y, size: 12, font, color: gray });

    // Footer
    page.drawText('Xamai - SAP Monterrey. El socio estratégico para su evolución continua.', {
        x: 40,
        y: 50,
        size: 10,
        font,
        color: rgb(0.5, 0.5, 0.5)
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
