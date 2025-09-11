import AWS from "aws-sdk";

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_SES_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SES_SECRET_KEY,
  region: process.env.AWS_REGION,
});

const ses = new AWS.SES({ apiVersion: "2010-12-01" });

/**
 * Sends an email using AWS SES
 * @param {Object} options
 * @param {string|string[]} options.to - Recipient(s)
 * @param {string} options.subject - Subject line
 * @param {string} options.text - Plain text body
 * @param {string} [options.html] - HTML body (optional)
 */
export const sendMail = async (mailOption) => {
  const { to, subject, text, html } = mailOption;
  const params = {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: Array.isArray(to) ? to : [to],
    },
    Message: {
      Subject: {
        Data: subject,
      },
      Body: {
        ...(text && { Text: { Data: text } }),
        ...(html && { Html: { Data: html } }),
      },
    },
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log("Email sent successfully:", result);
    return result;
  } catch (err) {
    console.error("Failed to send email:", err);
    throw new Error("Error sending email via AWS SES");
  }
};
