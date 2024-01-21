import axios from 'axios';
import { load } from 'cheerio';
import * as dotenv from 'dotenv';
dotenv.config();
import sendMessage from './send-sms.js';
import cron from 'node-cron';

const scrapeSeats = async () => {
    console.log(new Date().toString() + ": bot started scraping");

    try {
        await axios.get(process.env.LINK)
            .then(async ({ data }) => {
                const $ = load(data);

                // Get open seat count
                const seats = $('.open-seats-count')
                    .map((_, product) => {
                        const $product = $(product);
                        return $product.text();
                    })
                    .toArray();
                
                // Get waitlist count
                const waitlist = $('.waitlist-count')
                    .map((_, product) => {
                        const $product = $(product);
                        return $product.text();
                    })
                    .toArray();

                console.log(new Date().toString() + ": bot found " + seats[0] + " open seats and "
                            + waitlist[0] + " waitlist seats for JWG CMSC351");
                if (seats[0] > 0 || waitlist[0] > 0) {
                    sendMessage('Seats open for JWG CMSC351');
                    console.log(new Date().toString() + ": bot sent message to user");
                }
            });
        } catch (err) {
            sendMessage("something went wrong");
            console.log(new Date().toString() + ": " + err);
        }
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