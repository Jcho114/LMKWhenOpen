import puppeteer from "puppeteer";
import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';

const scrapeSeats = async () => {
    const browser = await puppeteer.launch({ headless: 'new'});
    const page = await browser.newPage();

    await page.goto(process.env.LINK);
    await page.setViewport({width: 1080, height: 1024});

    await page.waitForSelector('.open-seats-count', {
        visible: true
    });

    // await page.screenshot({ path: '1.png'});

    const data = await page.evaluate(() => {
        const element = document.querySelector('.open-seats-count');
        const seats = element.innerHTML;
        return seats;
    });

    await browser.close();
    console.log("Open seats for JWG CMSC351: " + data);
    return data;
}

const minutes = 1;
setInterval( scrapeSeats, 60000 * minutes );