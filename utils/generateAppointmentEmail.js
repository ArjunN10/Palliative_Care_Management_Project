// Define the email template function
const generateAppointmentEmail = (data) => {
    const {
        recipientName,
        name,
        email,
        date,
        phone,
        message
    } = data;

    return `
        Dear ${recipientName},

        I hope this email finds you well.

        I am writing to request an appointment with Pariraksha Palliative Society. I believe your expertise and services align perfectly with my needs.

        Below are my contact details and preferred appointment timing:

        - Name: ${name}
        - Email: ${email}
        - Date and Time Preference: ${date}
        - Contact Number: ${phone}

        Purpose of visit: ${message}

        I would appreciate it if you could confirm the availability of the requested slot and provide any necessary instructions for scheduling the appointment.

        Thank you for your attention to this matter. I look forward to hearing from you soon.

        Best regards,

        ${name}
    `;
};

module.exports = {
    generateAppointmentEmail
};
