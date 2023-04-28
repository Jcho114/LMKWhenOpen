import puppeteer from "puppeteer";
import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import sendMessage from "./send-sms.js";

const scrapeSeats = async () => {
    console.log(new Date().toString() + ": started scraping");
    const data = 0;

    try {
        const browser = await puppeteer.launch({ headless: 'new'});
        const page = await browser.newPage();

        await page.goto(process.env.LINK);
        await page.setViewport({width: 1080, height: 1024});

        await page.waitForSelector('.open-seats-count', {
            visible: true
        });

        const data = await page.evaluate(() => {
            const element = document.querySelector('.open-seats-count');
            const seats = element.innerHTML;
            return seats;
        });

        await browser.close();
        console.log(new Date().toString() + "open seats for JWG CMSC351: " + data);
        if (data > 0) {
            sendMessage('Seats open for JWG CMSC351');
            console.log(new Date().toString() + "sent message to user");
            await page.screenshot({ path: '1.png'});
        }
    } catch (err) {
        console.log(new Date().toString() + ": " + err);
    }

    console.log(new Date().toString() + ": scraping ended");
    return data;
}

const date = new Date();
console.log(date + ": bot started");
const waitSeconds = (61 - date.getSeconds());
setTimeout(() => {console.log(new Date().toString() + ": bot finished waiting")}, waitSeconds * 1000);

setInterval(scrapeSeats, 60000);
