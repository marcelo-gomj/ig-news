import { GetStaticProps } from "next";
import Head from "next/head";
import { stripe } from "../Services/stripes";
import { SubscribeButton } from "../components/SubscribeButton";
import styles from "../styles/Home.module.scss";

interface HomeProps {
   product: {
      priceId: string,
      amount: string
   }
}

export default function Home({product}: HomeProps) {
   return (
      <>
         <Head>
            <title>Inicio | Ig News</title>
         </Head>

         <main className={styles.ContentContainer}>
            <section className={styles.hero}>
               <span>👏 Hey, welcome</span>
               <h1>News about the <span>React</span> world.</h1>
               <p>
                  Get access to all the applications <br/>
                  <span>for {product.amount} month</span>
               </p>

               <SubscribeButton />
            </section>

            <img src="/images/avatar.svg" alt="girl coding" />
         </main>
      </>
   )
}

export const getStaticProps = async () => {
   const price = await stripe.prices.retrieve('price_1K7I6CEtoijdawI6JWjIF59e')
   const product = {
      priceId: price.id,
      amount : new Intl.NumberFormat('en-Us', {style: 'currency', currency: 'USD'})
      .format((price.unit_amount / 100))
   }

   return {
      props: {
         product
      },
      revalidate: 60 * 60 * 24 // 24 hours
   }
}