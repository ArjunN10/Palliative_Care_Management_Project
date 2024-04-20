// Define the email template function
const generateTestResult = (data) => {
    const {
        recipientName,
        name,
        email,
        test_result
        
    } = data;

    return `
    Dear ${email},

    I hope this email finds you well.
    
    We have completed the analysis of your test samples, and I am pleased to provide you with the results. Below, you will find the details:
    
    ${test_result}
    
    If you have any questions or require further explanation regarding your test results, please do not hesitate to contact us. Our team is available to assist you.
    
    Best regards,
    
    ${recipientName}
    pariraksha palliative care
    `;
};

module.exports = {
    generateTestResult
};
