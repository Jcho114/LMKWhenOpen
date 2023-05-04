import puppeteer from "puppeteer";
import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import sendMessage from "./send-sms.js";
import cron from 'node-cron';

const scrapeSeats = async () => {
    console.log(new Date().toString() + ": bot started scraping");
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
            let element = document.querySelector('.open-seats-count');
            const seats = element.innerHTML;
            element = document.querySelector('.waitlist-count');
            const waitlist = element.innerHTML;
            return [seats, waitlist];
        });

        await browser.close();
        console.log(new Date().toString() + ": bot found " + data[0] + " open seats and " + data[1] + " waitlist seats for JWG CMSC351");
        if (data[0] > 0 || data[1] > 0) {
            sendMessage('Seats open for JWG CMSC351');
            console.log(new Date().toString() + ": bot sent message to user");
            await page.screenshot({ path: '1.png'});
        }
    } catch (err) {
        console.log(new Date().toString() + ": " + err);
    }

    console.log(new Date().toString() + ": bot scraping ended");
    return data;
}

let seats = 0;
console.log(new Date().toString() + ": bot started");
console.log(new Date().toString() + ": bot waiting till next minute");

var task = cron.schedule('* * * * *', async () => {
    console.log(new Date().toString() + ": bot finished waiting");
    seats = await scrapeSeats();
    console.log(new Date().toString() + ": bot waiting till next minute");
});

task.start();

await new Promise(resolve => {
    function checkSeats() {
        if (seats > 0)
            resolve();
        else
            setTimeout(checkSeats, 1000 * 60 * 5);
    }
    checkSeats();
});

task.stop();

console.log(new Date().toString() + ': bot quitting');