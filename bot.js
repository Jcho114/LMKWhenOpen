import puppeteer from "puppeteer";
import * as dotenv from 'dotenv';

(async () => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();

    await page.goto();


})