import puppeteer from "puppeteer";
import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import sendMessage from "./send-sms";

const scrapeSeats = async () => {
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
    console.log("Open seats for JWG CMSC351: " + data);
    if (data > 0) {
        sendMessage('Seats open for JWG CMSC351');
        await page.screenshot({ path: '1.png'});
    }
    return data;
}

const minutes = 1;
setInterval( scrapeSeats, 60000 * minutes );

const date = new Date();
date.getHours;
date.getMinutes;
date.getSeconds;