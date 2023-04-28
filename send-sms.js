import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import twilio from 'twilio';

const accountSid = process.env.SID;
const authToken = process.env.TOKEN;

const client = twilio(accountSid, authToken);

const sendMessage = (message) => {
    client.messages.create({
        to: process.env.MY_PHONE_NUMBER,
        from: process.env.TWILIO_PHONE_NUMBER,
        body: message
    })
    .then((message) => console.log(message.sid));
}

export default sendMessage;