import {NextApiRequest, NextApiResponse } from 'next';
import {Readable } from 'stream';
import { Stripe } from 'stripe';
import {stripe } from '../../Services/stripes'

async function buffer(readable : Readable){
    const chunks = [];

    for await (const chunk of readable){
        chunks.push(
            typeof chunk === 'string' ? Buffer.from(chunk) : chunk
        );
    }

    return Buffer.concat(chunks);
}

export const config = {
    api: {
        bodyParser: false
    }
}

const relevantEvents = new Set([
    'checkout.session.completed'
])

export default async (req : NextApiRequest, res : NextApiResponse) => {
    if(req.method === 'POST'){
        const secret = req.headers['stripe-signature'];
        const buf = await buffer(req);

        let event : Stripe.Event;

        try{
            event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOK_SECRET);
        }catch(error){
            return res.status(400).send(`Webhooks error: ${error.message}`);
        }

        const type = event.type;

        if(!relevantEvents.has(type)){
            try{
                switch(type){
                    case 'checkout.session.completed':
                        break;
                    default:
                        throw new Error('Unhandled event.');
                }
            }catch(error){
                return res.json({error : 'Webhook handler failed.'})
            }
        }

        res.json({received : true});
    }else{
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method not allowed');
    }
    


}