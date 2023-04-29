import puppeteer from "puppeteer";
import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import sendMessage from "./send-sms.js";

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
            const element = document.querySelector('.open-seats-count');
            const seats = element.innerHTML;
            return seats;
        });

        await browser.close();
        console.log(new Date().toString() + ": bot found " + data + " open seats for JWG CMSC351");
        if (data > 0) {
            sendMessage('Seats open for JWG CMSC351');
            console.log(new Date().toString() + "sent message to user");
            await page.screenshot({ path: '1.png'});
        }
    } catch (err) {
        console.log(new Date().toString() + ": " + err);
    }

    console.log(new Date().toString() + ": bot scraping ended");
    return data;
}

let date = new Date();
let seats = 0;
let waitSeconds = 0;
console.log(date + ": bot started");

do {
    console.log(new Date().toString() + ": bot waiting till next minute");
    date = new Date();
    waitSeconds = (60 - date.getSeconds());
    await new Promise(r => setTimeout(r, waitSeconds * 1000));
    console.log(new Date().toString() + ": bot finished waiting")
    seats = await scrapeSeats();
} while (seats <= 0);
