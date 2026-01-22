import AWS from 'aws-sdk';
//envoyer des emails au support Ugram
AWS.config.update({
    region: "us-east-1",
    apiVersion: "latest",
    maxRetries: 3,
    httpOptions: { timeout: 30000, connectTimeout: 5000 },
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY?? '',
    },
})

const ses = new AWS.SES();

/**
 * Envoie d'email avec AWS
 */
async function sendEmail(emailParams: AWS.SES.SendEmailRequest) {
  try {
   
    const result = await ses.sendEmail(emailParams).promise();
    console.log('Email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
export default sendEmail;