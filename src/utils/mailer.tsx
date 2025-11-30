import nodemailer from "nodemailer";

type MailOptions = {
  to: string,
  text: string,
  subject: string,
  messages: string[],
  code?: null | string,
  link?: { cap: string , address: string, title: string } | null,
}

type templateOptions = {
  title: string,
  messages: string[],
  code: string | null,
  link: { cap: string , address: string, title: string } | null
}

// Initialize transporter with better error handling
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Email credentials not configured");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const generateTemplate = ({
  code,
  link,
  title,
  messages,
}: templateOptions ) => {
  const yr = new Date().getFullYear();
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  
  // Font stack with multiple fallbacks
  const fontStack = "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

  // Regular template
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <!--[if mso]>
      <style>
        * { font-family: Arial, sans-serif !important; }
      </style>
      <![endif]-->
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
        body { margin: 0; padding: 0; }
        table { border-spacing: 0; }
        td { padding: 0; }
        img { border: 0; display: block; }
      </style>
    </head>
    <body style="margin:0; padding:0; font-family:${fontStack}; background-color:#f4f4f4;">
      <!-- Main Container -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f4;">
        <tr>
          <td align="center" style="padding:20px 10px;">
            <!-- Email Content Container -->
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff; max-width:600px; width:100%;">
              
              <!-- Logo at Top -->
              <tr>
                <td align="center" style="padding:30px 30px 10px;">
                  <img src="${baseUrl}/full-coden-logo.png" alt="Cod-en+" width="120" style="display:block; border:0; height:auto; margin:0 auto;" />
                </td>
              </tr>
              
              <!-- Header Spacing -->
              <tr>
                <td style="padding:20px 30px;">
                  ${title ? `
                    <h1 style="margin:0 0 20px; color:#bb6a5e; font-size:24px; font-weight:600; line-height:1.4; font-family:${fontStack};">
                      ${title}
                    </h1>
                  ` : ""}
                  
                  <!-- If OTP type -->
                  ${
                    code && `<tr>
                      <td align="center" style="padding:50px;">
                        <div style="
                          background:#fff0e2;
                          padding:30px 20px;
                          border-radius:15px;
                          box-shadow:0 3px 6px rgba(0,0,0,0.15);
                          font-size:30px;
                          font-weight:700;
                          color:#323232;
                          letter-spacing:8px;
                          font-family:${fontStack};
                          line-height:1.2;
                        ">
                          ${code}
                        </div>
                      </td>
                    </tr>`
                  }

                  <!-- Messages -->
                  ${messages?.map((m) => `
                    <p style="margin:0 0 15px; color:#323232; font-size:15px; line-height:1.6; font-family:${fontStack};">
                      ${m}
                    </p>
                  `).join("") || ''}
                  
                  <!-- Link -->
                  ${link ? `
                    <p style="margin:20px 0 0; color:#323232; font-size:15px; line-height:1.6; font-family:${fontStack};">
                      ${link.cap}
                      <a href="${baseUrl}${link.address}" style="color:#975998; text-decoration:underline; font-family:${fontStack};">
                        ${link.title}
                      </a>
                    </p>
                  ` : ""}
                </td>
              </tr>
              
              <!-- Action Buttons -->
              <tr>
                <td style="padding:0 30px 30px;">
                  <!--[if mso]>
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td width="48%" style="padding-bottom:15px;">
                  <![endif]-->
                  <div style="display:inline-block; width:48%; min-width:200px; vertical-align:top; margin-bottom:15px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background-color:#fff0e2; border-radius:25px; border-bottom-right-radius:5px; box-shadow:0 2px 4px rgba(0,0,0,0.15);">
                          <a href="${baseUrl}/projects/new" style="display:block; padding:10px 15px; text-decoration:none; color:#323232;">
                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                              <tr>
                                <td width="24" valign="middle">
                                  <svg style="width:21px; height:21px; display:block;" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="#323232" d="M14.064 0h.186C15.216 0 16 .784 16 1.75v.186a8.752 8.752 0 0 1-2.564 6.186l-.458.459c-.314.314-.641.616-.979.904v3.207c0 .608-.315 1.172-.833 1.49l-2.774 1.707a.749.749 0 0 1-1.11-.418l-.954-3.102a1.214 1.214 0 0 1-.145-.125L3.754 9.816a1.218 1.218 0 0 1-.124-.145L.528 8.717a.749.749 0 0 1-.418-1.11l1.71-2.774A1.748 1.748 0 0 1 3.31 4h3.204c.288-.338.59-.665.904-.979l.459-.458A8.749 8.749 0 0 1 14.064 0ZM8.938 3.623h-.002l-.458.458c-.76.76-1.437 1.598-2.02 2.5l-1.5 2.317 2.143 2.143 2.317-1.5c.902-.583 1.74-1.26 2.499-2.02l.459-.458a7.25 7.25 0 0 0 2.123-5.127V1.75a.25.25 0 0 0-.25-.25h-.186a7.249 7.249 0 0 0-5.125 2.123ZM3.56 14.56c-.732.732-2.334 1.045-3.005 1.148a.234.234 0 0 1-.201-.064.234.234 0 0 1-.064-.201c.103-.671.416-2.273 1.15-3.003a1.502 1.502 0 1 1 2.12 2.12Zm6.94-3.935c-.088.06-.177.118-.266.175l-2.35 1.521.548 1.783 1.949-1.2a.25.25 0 0 0 .119-.213ZM3.678 8.116 5.2 5.766c.058-.09.117-.178.176-.266H3.309a.25.25 0 0 0-.213.119l-1.2 1.95ZM12 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/>
                                  </svg>
                                </td>
                                <td style="padding-left:10px; font-size:14px; font-weight:600; color:#323232; font-family:${fontStack};">
                                  Create new project
                                </td>
                              </tr>
                            </table>
                          </a>
                        </td>
                      </tr>
                    </table>
                  </div>
                  <!--[if mso]>
                      </td>
                      <td width="4%"></td>
                      <td width="48%" style="padding-bottom:15px;">
                  <![endif]-->
                  <!--[if !mso]><!-->
                  <div style="display:inline-block; width:4%; min-width:10px;"></div>
                  <!--<![endif]-->
                  <div style="display:inline-block; width:48%; min-width:200px; vertical-align:top; margin-bottom:15px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background-color:#fff0e2; border-radius:25px; border-bottom-right-radius:5px; box-shadow:0 2px 4px rgba(0,0,0,0.15);">
                          <a href="${baseUrl}/help" style="display:block; padding:10px 15px; text-decoration:none; color:#323232;">
                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                              <tr>
                                <td width="24" valign="middle">
                                  <svg style="width:21px; height:21px; display:block;" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="128" cy="128" fill="none" r="96" stroke="#323232" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/>
                                    <circle cx="128" cy="180" r="12" fill="#323232"/>
                                    <path d="M128,144v-8a28,28,0,1,0-28-28" fill="none" stroke="#323232" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/>
                                  </svg>
                                </td>
                                <td style="padding-left:10px; font-size:14px; font-weight:600; color:#323232; font-family:${fontStack};">
                                  Read help pages
                                </td>
                              </tr>
                            </table>
                          </a>
                        </td>
                      </tr>
                    </table>
                  </div>
                  <!--[if mso]>
                      </td>
                    </tr>
                  </table>
                  <![endif]-->
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding:30px 30px 20px; border-top:1px solid #e0e0e0;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td align="center" style="padding-bottom:20px;">
                        <a href="${baseUrl}" style="text-decoration:none; display:inline-block;">
                          <img src="${baseUrl}/full-coden-logo.png" alt="Cod-en+" width="100" style="display:block; border:0; height:auto; margin:0 auto;" />
                        </a>
                        <p style="margin:10px 0 0; font-size:14px; color:#666666; font-family:${fontStack};">
                          Copyright © ${yr}
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Social Links -->
                    <tr>
                      <td align="center" style="padding-top:15px;">
                        <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                          <tr>
                            <td style="padding:0 7px;">
                              <a href="https://github.com/Nem-sol/Cod-en" target="_blank" style="color:#323232;">
                                <img src="${baseUrl}/icons/github.png" alt="GitHub" width="20" height="20" style="display:block; border:0;" />
                              </a>
                            </td>
                            <td style="padding:0 7px;">
                              <a href="#" target="_blank" style="color:#323232;">
                                <img src="${baseUrl}/icons/twitter.png" alt="Twitter" width="20" height="20" style="display:block; border:0;" />
                              </a>
                            </td>
                            <td style="padding:0 7px;">
                              <a href="#" target="_blank" style="color:#323232;">
                                <img src="${baseUrl}/icons/facebook.png" alt="Facebook" width="20" height="20" style="display:block; border:0;" />
                              </a>
                            </td>
                            <td style="padding:0 7px;">
                              <a href="#" target="_blank" style="color:#323232;">
                                <img src="${baseUrl}/icons/youtube.png" alt="YouTube" width="20" height="20" style="display:block; border:0;" />
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Terms Link -->
                    <tr>
                      <td align="center" style="padding-top:20px;">
                        <a href="${baseUrl}/help/policy" style="font-size:14px; color:#975998; text-decoration:none; font-family:${fontStack};">
                          Terms and Policy
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

export default async function sendMail({
  to,
  text,
  link,
  subject,
  messages,
  code = null,
}: MailOptions ) {

  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      to,
      text,
      subject,
      from: `"Cod-en" <${process.env.EMAIL_USER}>`,
      html: generateTemplate({ 
        code,
        messages, 
        title: subject, 
        link: link || { 
          title: "Cod-en help",
          cap: "For more information, visit ", 
          address: "/help", 
        } 
      }),
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    if ( err instanceof Error ) console.error("Email send failed:", err.message);
    return false;
  }
}