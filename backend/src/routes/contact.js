import { Router } from 'express';
import { validateContact } from '../middleware/validateContact.js';
import { sendContactEmail } from '../utils/mailer.js';

const router = Router();

router.post('/send', validateContact, async (req, res) => {
  try {
    await sendContactEmail(req.validatedContact);

    return res.status(200).json({
      message: 'Góp ý đã được gửi thành công. Chúng tôi sẽ phản hồi sớm nhất!',
    });
  } catch (error) {
    console.error('Send contact email error:', error);

    if (error.message === 'SMTP is not configured on the server') {
      return res.status(503).json({
        message: 'Hệ thống email chưa được cấu hình. Vui lòng liên hệ quản trị viên.',
      });
    }

    return res.status(500).json({
      message: 'Không thể gửi email. Vui lòng thử lại sau.',
    });
  }
});

export default router;
