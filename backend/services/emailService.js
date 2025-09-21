const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendOTP(email, otp, type = 'verification') {
    try {
      const subject = type === 'verification' 
        ? 'PeerChain - Email Verification Code'
        : 'PeerChain - Password Reset Code';

      const html = this.generateOTPEmail(otp, type);

      const mailOptions = {
        from: `"PeerChain Academic Platform" <${process.env.EMAIL_USER}>`,
        to: email,
        subject,
        html
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  generateOTPEmail(otp, type) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PeerChain Verification</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .otp-code { background: #667eea; color: white; font-size: 32px; font-weight: bold; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; letter-spacing: 5px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎓 PeerChain Academic Platform</h1>
            <p>VIT University Verification System</p>
          </div>
          <div class="content">
            <h2>${type === 'verification' ? 'Email Verification' : 'Password Reset'}</h2>
            <p>Hello,</p>
            <p>You have requested to ${type === 'verification' ? 'verify your VIT email address' : 'reset your password'} on the PeerChain platform.</p>
            
            <div class="otp-code">${otp}</div>
            
            <p><strong>Please use this code to complete your ${type === 'verification' ? 'email verification' : 'password reset'}.</strong></p>
            
            <div class="warning">
              <strong>⚠️ Important:</strong>
              <ul>
                <li>This code is valid for 5 minutes only</li>
                <li>Do not share this code with anyone</li>
                <li>If you didn't request this, please ignore this email</li>
              </ul>
            </div>
            
            <p>If you have any questions, please contact our support team.</p>
            
            <div class="footer">
              <p>Best regards,<br>The PeerChain Team</p>
              <p>VIT University Academic Platform</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async sendWelcomeEmail(email, name) {
    try {
      const html = this.generateWelcomeEmail(name);

      const mailOptions = {
        from: `"PeerChain Academic Platform" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Welcome to PeerChain - Complete Your Verification',
        html
      };

      const result = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Welcome email failed:', error);
      return { success: false, error: error.message };
    }
  }

  generateWelcomeEmail(name) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to PeerChain</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .cta-button { background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
          .features { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎓 Welcome to PeerChain!</h1>
            <p>VIT University Academic Platform</p>
          </div>
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p>Welcome to PeerChain, the premier academic verification and collaboration platform for VIT University students and researchers.</p>
            
            <div class="features">
              <h3>🚀 What you can do:</h3>
              <ul>
                <li>✅ Submit and review research papers</li>
                <li>🔗 Connect with verified researchers</li>
                <li>📊 Track your academic activity</li>
                <li>🏆 Build your academic reputation</li>
                <li>💬 Collaborate on research projects</li>
              </ul>
            </div>
            
            <p><strong>Next Step:</strong> Complete your academic verification to access all features.</p>
            
            <a href="${process.env.FRONTEND_URL}/verification" class="cta-button">Complete Verification</a>
            
            <p>If you have any questions, feel free to reach out to our support team.</p>
            
            <p>Best regards,<br>The PeerChain Team</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService();
