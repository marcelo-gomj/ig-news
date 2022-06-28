import { render, screen } from '@testing-library/react';
import Home, { getStaticProps } from '../../pages';
import { mocked } from 'ts-jest/cli';
import { stripe } from '../../Services/stripes';

jest.mock('next/router');
jest.mock('next-auth/react', () => {
    return {
        useSession: () => [null, false]
    }
})

jest.mock('../../services/stripe');

describe('Home page', () => {
    it('renders correctly', () => {
        render(
            <Home product={{
                priceId: 'fake-price-id',
                amount: 'R$ 10,00'
            }} />
        )

        expect(screen.getByText('for R$ 10,00 month')).toBeInDocument()
    });

    it('loads initial data', async () => {
        const retriveStripeProcesMocked = mocked(stripe.prices.retrieve);

        retriveStripeProcesMocked.mockResolvedValueOnce({
            id: 'fake-price-id',
            unit_amout: 10000
        } as any);
    
        const response = await getStaticProps();

        // Checa se o objeto da resposta tem o mesmo valor
        // Checagem não rigorosa com o .objectContaining
        expect(response).toEquals(
            expect.objectContaining({
                props : {
                    product: {
                        priceId: 'fake-price-id',
                        amout: '$10.00'
                    }
                }
            })
        )
    })


})