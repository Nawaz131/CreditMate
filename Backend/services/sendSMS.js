const axios = require("axios");

const sendSMS = async (phone, message) => {
    const deviceId = process.env.TEXTBEE_DEVICE_ID;
    const apiKey = process.env.TEXTBEE_API_KEY;

    if (!deviceId || !apiKey) {
        throw new Error("TextBee Device ID or API Key is missing");
    }

    let formattedPhone = String(phone).trim();

    if (!formattedPhone.startsWith("+")) {
        formattedPhone = `+91${formattedPhone}`;
    }

    const response = await axios.post(
        `https://api.textbee.dev/api/v1/gateway/devices/${deviceId}/send-sms`,
        {
            recipients: [formattedPhone],
            message: message,
        },
        {
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
            },
        }
    );

    return response.data;
};

module.exports = sendSMS;
