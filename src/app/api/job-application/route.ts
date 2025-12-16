import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, position, message, cvUrl } = body;

    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      console.error("ADMIN_EMAIL no está definido en .env.local");
      return NextResponse.json(
        { ok: false, error: "Configuración del servidor incompleta" },
        { status: 500 }
      );
    }

    await resend.emails.send({
        from: "Conecta2 Web <onboarding@resend.dev>",
        to: adminEmail,
        subject: `Nueva solicitud de trabajo – ${name}`,
      html: `
  <!DOCTYPE html>
  <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Nueva solicitud de trabajo</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #f3f4f6;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .wrapper {
          width: 100%;
          padding: 24px 12px;
          box-sizing: border-box;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
          border: 1px solid #e5e7eb;
        }
        .header {
          background: linear-gradient(135deg, #4f46e5, #6366f1);
          color: #ffffff;
          padding: 20px 24px;
        }
        .header-title {
          margin: 0;
          font-size: 20px;
          font-weight: 700;
          letter-spacing: 0.02em;
        }
        .header-subtitle {
          margin: 6px 0 0 0;
          font-size: 13px;
          opacity: 0.9;
        }
        .content {
          padding: 20px 24px 8px 24px;
          color: #111827;
          font-size: 14px;
          line-height: 1.6;
        }
        .section-title {
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 8px 0;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #6b7280;
        }
        .info-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 16px;
        }
        .info-row {
          border-bottom: 1px solid #e5e7eb;
        }
        .info-label {
          width: 40%;
          padding: 8px 0;
          font-weight: 600;
          color: #4b5563;
          vertical-align: top;
        }
        .info-value {
          width: 60%;
          padding: 8px 0;
          color: #111827;
        }
        .badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 999px;
          background-color: #eef2ff;
          color: #4f46e5;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .message-box {
          background-color: #f9fafb;
          border-radius: 10px;
          padding: 12px 14px;
          border: 1px solid #e5e7eb;
          white-space: pre-wrap;
        }
        .footer {
          padding: 14px 24px 18px 24px;
          font-size: 11px;
          color: #6b7280;
          border-top: 1px solid #e5e7eb;
          background-color: #f9fafb;
        }
        .footer strong {
          color: #4b5563;
        }
        a {
          color: #4f46e5;
        }
        @media (max-width: 640px) {
          .container {
            border-radius: 10px;
          }
          .header, .content, .footer {
            padding-left: 16px;
            padding-right: 16px;
          }
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <p class="badge">Nueva solicitud</p>
            <h1 class="header-title">Aplicación de ${name}</h1>
            <p class="header-subtitle">
              Has recibido una nueva solicitud de trabajo desde el sitio web de Conecta2.
            </p>
          </div>

          <div class="content">
            <p>
              <strong>Hola,</strong><br />
              A continuación encontrarás los detalles de la persona que completó el formulario:
            </p>

            <h2 class="section-title">Datos de contacto</h2>
            <table class="info-table">
              <tr class="info-row">
                <td class="info-label">Nombre completo</td>
                <td class="info-value">${name || "No indicado"}</td>
              </tr>
              <tr class="info-row">
                <td class="info-label">Correo electrónico</td>
                <td class="info-value">
                  ${email ? `<a href="mailto:${email}">${email}</a>` : "No indicado"}
                </td>
              </tr>
              <tr class="info-row">
                <td class="info-label">Teléfono / WhatsApp</td>
                <td class="info-value">${phone || "No indicado"}</td>
              </tr>
              <tr class="info-row">
                <td class="info-label">Área o puesto de interés</td>
                <td class="info-value">${position || "No indicado"}</td>
              </tr>
              <tr class="info-row">
                <td class="info-label">CV / Portafolio</td>
                <td class="info-value">
                  ${
                    cvUrl
                      ? `<a href="${cvUrl}" target="_blank" rel="noopener noreferrer">${cvUrl}</a>`
                      : "No proporcionado"
                  }
                </td>
              </tr>
            </table>

            <h2 class="section-title">Mensaje del candidato</h2>
            <div class="message-box">
              ${message ? String(message).replace(/\n/g, "<br/>") : "Sin mensaje adicional."}
            </div>
          </div>

          <div class="footer">
            <p>
              <strong>Conecta2 – Plataforma de talento y oportunidades.</strong><br />
              Este correo fue generado automáticamente desde el formulario de contacto de tu sitio web.
            </p>
            <p>
              Si este mensaje no era esperado, simplemente puedes ignorarlo.
            </p>
          </div>
        </div>
      </div>
    </body>
  </html>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error enviando correo:", error);
    return NextResponse.json(
      { ok: false, error: "Hubo un error enviando la solicitud" },
      { status: 500 }
    );
  }
}
