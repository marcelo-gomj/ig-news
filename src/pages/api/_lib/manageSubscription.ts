import { query as q } from 'faunadb';

import { fauna } from "../../../Services/fauna";
import { stripe } from "../../../Services/stripes";

export async function saveSubscription(
    subscriptionId: string,
    customerId: string,
    createdAction = false,
){
    const userRef = await fauna.query(
        q.Select(
            "ref",
            q.Get(
                q.Match(
                    q.Index('user_by_stripe_customer_id'), customerId
                )
            )
        )
    )

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    const subscriptionData = {
        id : subscription.id,
        userId : userRef,
        status : subscription.status,
        price_id : subscription.items.data[0].price.id,
    }
    
    // Cria ou atualiza os dados do Fauna
    if(createdAction){
        await fauna.query(
            q.Create(
                q.Collection('subscriptions'),
                {data : subscriptionData}
            )
        )
    }else{
        await fauna.query(
            q.Replace(
                q.Select(
                    "ref",
                    q.Get(
                        q.Match(
                            q.Index('subscription_by_id'),
                            subscriptionId,
                        )
                    )
                ),

                {data : subscriptionData}
            )
        )
    }
}