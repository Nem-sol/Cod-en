import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const genrateTemplate = ({
  code,
  link,
  title,
  types,
  messages,
}) => {
  // If OTP type
  if (types?.toLowerCase().includes("otp")) {
    // no content yet but function safe
  }

  const yr = `${new Date().getFullYear()}`
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
        body { margin: 0; padding: 0; }
        table { border-spacing: 0; }
        td { padding: 0; }
        img { border: 0; }
        * { font-family: 'Poppins', Arial, Helvetica, sans-serif !important; }
      </style>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4;">
      <!-- Main Container -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4;">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <!-- Email Content Container -->
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; max-width: 600px;">
              
              <!-- Logo at Top -->
              <tr>
                <td align="center" style="padding: 30px 30px 10px 30px;">
                  <img src="${process.env.NEXTAUTH_URL}/full-coden-logo.png" alt="Cod-en+" width="120" style="display: block; border: 0;" />
                </td>
              </tr>
              
              <!-- Header Spacing -->
              <tr>
                <td style="padding: 20px 30px 20px 30px;">
                  ${title ? `
                    <h1 style="margin: 0 0 20px 0; color: #000000; font-size: 24px; font-weight: 600; line-height: 1.4;">
                      ${title}
                    </h1>
                  ` : ""}
                  
                  <!-- Messages -->
                  ${messages?.map((m) => `
                    <p style="margin: 0 0 15px 0; color: #323232; font-size: 15px; line-height: 1.6;">
                      ${m}
                    </p>
                  `).join("")}
                  
                  <!-- Link -->
                  ${link ? `
                    <p style="margin: 20px 0 0 0; color: #323232; font-size: 15px; line-height: 1.6;">
                      ${link.cap}
                      <a href="${process.env.NEXTAUTH_URL}${link.address}" style="color: #975998; text-decoration: underline;">
                        ${link.title}
                      </a>
                    </p>
                  ` : ""}
                </td>
              </tr>
              
              <!-- Action Buttons -->
              <tr>
                <td style="padding: 0 30px 30px 30px;">
                  <!--[if mso]>
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td width="48%" style="padding-bottom: 15px;">
                  <![endif]-->
                  <div style="display: inline-block; width: 48%; min-width: 200px; vertical-align: top; margin-bottom: 15px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background-color: #fff0e2; border-radius: 25px; border-bottom-right-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.15);">
                          <a href="${process.env.NEXTAUTH_URL}/projects/new" style="display: block; padding: 10px 15px; text-decoration: none; color: #323232;">
                            <table cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td width="24" valign="middle">
                                  <svg style="width: 21px; height: 21px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="#323232" d="M14.064 0h.186C15.216 0 16 .784 16 1.75v.186a8.752 8.752 0 0 1-2.564 6.186l-.458.459c-.314.314-.641.616-.979.904v3.207c0 .608-.315 1.172-.833 1.49l-2.774 1.707a.749.749 0 0 1-1.11-.418l-.954-3.102a1.214 1.214 0 0 1-.145-.125L3.754 9.816a1.218 1.218 0 0 1-.124-.145L.528 8.717a.749.749 0 0 1-.418-1.11l1.71-2.774A1.748 1.748 0 0 1 3.31 4h3.204c.288-.338.59-.665.904-.979l.459-.458A8.749 8.749 0 0 1 14.064 0ZM8.938 3.623h-.002l-.458.458c-.76.76-1.437 1.598-2.02 2.5l-1.5 2.317 2.143 2.143 2.317-1.5c.902-.583 1.74-1.26 2.499-2.02l.459-.458a7.25 7.25 0 0 0 2.123-5.127V1.75a.25.25 0 0 0-.25-.25h-.186a7.249 7.249 0 0 0-5.125 2.123ZM3.56 14.56c-.732.732-2.334 1.045-3.005 1.148a.234.234 0 0 1-.201-.064.234.234 0 0 1-.064-.201c.103-.671.416-2.273 1.15-3.003a1.502 1.502 0 1 1 2.12 2.12Zm6.94-3.935c-.088.06-.177.118-.266.175l-2.35 1.521.548 1.783 1.949-1.2a.25.25 0 0 0 .119-.213ZM3.678 8.116 5.2 5.766c.058-.09.117-.178.176-.266H3.309a.25.25 0 0 0-.213.119l-1.2 1.95ZM12 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/>
                                  </svg>
                                </td>
                                <td style="padding-left: 10px; font-size: 14px; font-weight: 600; color: #323232;">
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
                      <td width="48%" style="padding-bottom: 15px;">
                  <![endif]-->
                  <!--[if !mso]><!-->
                  <div style="display: inline-block; width: 4%; min-width: 10px;"></div>
                  <!--<![endif]-->
                  <div style="display: inline-block; width: 48%; min-width: 200px; vertical-align: top; margin-bottom: 15px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background-color: #fff0e2; border-radius: 25px; border-bottom-right-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.15);">
                          <a href="${process.env.NEXTAUTH_URL}/help" style="display: block; padding: 10px 15px; text-decoration: none; color: #323232;">
                            <table cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td width="24" valign="middle">
                                  <svg style="width: 21px; height: 21px" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="128" cy="128" fill="none" r="96" stroke="#323232" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/>
                                    <circle cx="128" cy="180" r="12" fill="#323232"/>
                                    <path d="M128,144v-8a28,28,0,1,0-28-28" fill="none" stroke="#323232" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/>
                                  </svg>
                                </td>
                                <td style="padding-left: 10px; font-size: 14px; font-weight: 600; color: #323232;">
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
                <td style="padding: 30px 30px 20px 30px; border-top: 1px solid #e0e0e0;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <!-- Logo and Copyright -->
                      <td style="padding-bottom: 20px;" align="center">
                        <a href="${process.env.NEXTAUTH_URL}" style="text-decoration: none; display: inline-block;">
                          <img src="${process.env.NEXTAUTH_URL}/full-coden-logo.png" alt="Cod-en+" width="100" style="display: block; border: 0;" />
                        </a>
                        <p style="margin: 10px 0 0 0; font-size: 14px; color: #666666;">
                          Copyright © ${yr}
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Social Links -->
                    <tr>
                      <td style="padding-top: 15px;">
                        <table cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td style="padding-right: 15px;">
                              <a href="https://github.com/Nem-sol/Cod-en" target="_blank" style="color: #323232;">
                                <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56">
                                  <path fill="#323232" d="M28 0C12.54 0 0 12.54 0 28c0 12.37 8.02 22.86 19.15 26.57 1.4.26 1.91-.61 1.91-1.35 0-.66-.02-2.43-.04-4.76-7.79 1.69-9.43-3.75-9.43-3.75-1.27-3.23-3.11-4.1-3.11-4.1-2.54-1.74.19-1.7.19-1.7 2.81.2 4.29 2.89 4.29 2.89 2.5 4.28 6.55 3.04 8.15 2.33.25-1.81.98-3.04 1.78-3.74-6.22-.71-12.75-3.11-12.75-13.84 0-3.06 1.09-5.56 2.88-7.51-.29-.71-1.25-3.56.27-7.41 0 0 2.35-.75 7.7 2.87 2.23-.62 4.63-.93 7.01-.94 2.38.01 4.77.32 7.01.94 5.35-3.62 7.69-2.87 7.69-2.87 1.53 3.85.57 6.7.28 7.41 1.79 1.96 2.88 4.46 2.88 7.51 0 10.76-6.55 13.12-12.78 13.82 1.01.86 1.9 2.57 1.9 5.19 0 3.74-.03 6.76-.03 7.68 0 .75.5 1.62 1.93 1.35C47.98 50.86 56 40.37 56 28 56 12.54 43.46 0 28 0z"/>
                                </svg>
                              </a>
                            </td>
                            <td style="padding-right: 15px;">
                              <a href="#" target="_blank" style="color: #323232;">
                                <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1227" fill="none">
                                  <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="#323232"/>
                                </svg>
                              </a>
                            </td>
                            <td style="padding-right: 15px;">
                              <a href="#" target="_blank" style="color: #323232;">
                                <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 25" fill="none">
                                  <path d="M12 2.53906C17.5229 2.53906 22 7.01621 22 12.5391C22 17.5304 18.3431 21.6674 13.5625 22.4176V15.4297H15.8926L16.3359 12.5391L13.5625 12.5387V10.6632C13.5625 10.657 13.5625 10.6509 13.5626 10.6447C13.5626 10.6354 13.5628 10.6262 13.5629 10.6169C13.578 9.84259 13.9742 9.10156 15.1921 9.10156H16.4531V6.64062C16.4531 6.64062 15.3087 6.44492 14.2146 6.44492C11.966 6.44492 10.4842 7.78652 10.4386 10.2193C10.4379 10.2578 10.4375 10.2965 10.4375 10.3355V12.5387H7.89844V15.4293L10.4375 15.4297V22.4172C5.65686 21.667 2 17.5304 2 12.5391C2 7.01621 6.47715 2.53906 12 2.53906Z" fill="#323232"/>
                                </svg>
                              </a>
                            </td>
                            <td style="padding-right: 15px;">
                              <a href="#" target="_blank" style="color: #323232;">
                                <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 25">
                                  <path fill="#323232" d="M23.3,7.3c0-0.2-0.3-1.8-1-2.5c-0.9-1-1.9-1.1-2.4-1.1l-0.1,0c-3.1-0.2-7.7-0.2-7.8-0.2c0,0-4.7,0-7.8,0.2l-0.1,0c-0.5,0-1.5,0.1-2.4,1.1c-0.7,0.8-1,2.4-1,2.6c0,0.1-0.2,1.9-0.2,3.8v1.7c0,1.9,0.2,3.7,0.2,3.8c0,0.2,0.3,1.8,1,2.5c0.8,0.9,1.8,1,2.4,1.1c0.1,0,0.2,0,0.3,0c1.8,0.2,7.3,0.2,7.5,0.2c0,0,0,0,0,0c0,0,4.7,0,7.8-0.2l0.1,0c0.5-0.1,1.5-0.2,2.4-1.1c0.7-0.8,1-2.4,1-2.6c0-0.1,0.2-1.9,0.2-3.8v-1.7C23.5,9.3,23.3,7.4,23.3,7.3z M15.9,12.2l-6,3.2c-0.1,0-0.1,0.1-0.2,0.1c-0.1,0-0.2,0-0.2-0.1c-0.1-0.1-0.2-0.2-0.2-0.4l0-6.5c0-0.2,0.1-0.3,0.2-0.4S9.8,8,10,8.1l6,3.2c0.2,0.1,0.3,0.2,0.3,0.4S16.1,12.1,15.9,12.2z"/>
                                </svg>
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Terms Link -->
                    <tr>
                      <td style="padding-top: 20px;">
                        <a href="${process.env.NEXTAUTH_URL}/help/policy" style="font-size: 14px; color: #975998; text-decoration: none;">
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
  code,
  link,
  types,
  subject,
  messages,
  title = null,
}) {
  try {
    await transporter.sendMail({
      to,
      text,
      subject,
      from: "Cod-en",
      html: genrateTemplate({ 
        code, 
        types, 
        messages, 
        title: title || subject , 
        link: link || { 
          cap: "For more information, visit ", 
          address: "/help", 
          title: "Cod-en help" 
        } 
      }),
    });

    return true;
  } catch (err) {
    console.error("Email send failed:", err);
    return false;
  }
}