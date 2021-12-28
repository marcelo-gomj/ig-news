import { error } from 'console';
import {NextApiRequest, NextApiResponse } from 'next';
import {Readable } from 'stream';
import { Stripe } from 'stripe';
import {stripe } from '../../Services/stripes'
import { saveSubscription } from './_lib/manageSubscription';

// código para ler inforacões do webhooks
async function buffer(readable : Readable){
    const chunks = [];

    for await (const chunk of readable){
        chunks.push(
            typeof chunk === 'string' ? Buffer.from(chunk) : chunk
        );
    }

    return Buffer.concat(chunks);
}

// Desabiilita a function padrão do next js

export const config = {
    api: {
        bodyParser: false
    }
}

// Ler os principais eventos do webhooks
const relevantEvents = new Set([
    'checkout.session.completed',
    'customer.subscription.deleted',
    'customer.subscription.updated',
])

export default async (req : NextApiRequest, res : NextApiResponse) => {
    if(req.method === 'POST'){
        const secret = req.headers['stripe-signature'];
        const buf = await buffer(req);

        let event : Stripe.Event;

        try{
            event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOK_SECRET);
        }catch(error){
            console.log(error)
        }

        const { type } = event;

        if(relevantEvents.has(type)){
            try{
                switch(type){
                    case 'customer.subscription.deleted':
                    case 'customer.subscription.updated':
                        const subscription = event.data.object as Stripe.Checkout.Session     

                        await saveSubscription(
                            subscription.id,
                            subscription.customer.toString(),
                            false
                        )
                    
                        break;
                    case 'checkout.session.completed':
                        const checkoutSession = event.data.object as Stripe.Checkout.Session;
                        
                        await saveSubscription(
                            checkoutSession.subscription.toString(),
                            checkoutSession.customer.toString(),
                            true
                        )
                        
                        break;
                    default:
                        console.log('ERR0R')
                        break;
                }
            }catch(error){
                console.log(error)
            }
        }

        res.json({received : true});
    }else{
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method not allowed');
    }
    


}