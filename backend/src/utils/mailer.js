import nodemailer from 'nodemailer';

let transporter;

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  return transporter;
}

export async function sendContactEmail(payload) {
  const mailer = getTransporter();

  if (!mailer) {
    throw new Error('SMTP is not configured on the server');
  }

  const receiver = process.env.CONTACT_RECEIVER_EMAIL || process.env.SMTP_USER;

  const html = `
    <h2>Góp ý mới từ Unimate</h2>
    <p><strong>Họ tên:</strong> ${payload.name}</p>
    <p><strong>Email:</strong> ${payload.email}</p>
    <p><strong>Số điện thoại:</strong> ${payload.phone}</p>
    <p><strong>Tiêu đề:</strong> ${payload.subject}</p>
    <p><strong>Nội dung:</strong></p>
    <p>${payload.message.replace(/\n/g, '<br>')}</p>
  `;

  await mailer.sendMail({
    from: `"Unimate Contact" <${process.env.SMTP_USER}>`,
    to: receiver,
    replyTo: payload.email,
    subject: `[Unimate Góp ý] ${payload.subject}`,
    text: `
Họ tên: ${payload.name}
Email: ${payload.email}
Số điện thoại: ${payload.phone}
Tiêu đề: ${payload.subject}

Nội dung:
${payload.message}
    `.trim(),
    html,
  });
}
