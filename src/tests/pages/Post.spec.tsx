import { render, screen } from '@testing-library/react';
import Post, { getServerSideProps } from '../../pages/posts/[slug]';
import { mocked } from 'ts-jest/cli';
import { getPrismicClient } from '../../Services/prismic'

const post = 
    {
        slug: 'my-new-posts',
        title: 'My New Post',
        content: '<p>Post exercpt</p>',
        updatedAt: '10 de april'
    }

jest.mock('next-auth/client');
jest.mock('../../services/prismic');

describe('Posts page', () => {
    it('renders correctly', () => {
        render(
            <Post post={post} />
        )

        expect(screen.getByText('My New Post')).toBeInDocument()
        expect(screen.getByText('Post excerpt')).toBeInDocument()
        
    });

    it('redirects user if no subscription is found', async () => {

        const response = await getServerSideProps({
            req : {
                cookies : {},
            },
        }as any);

        // Checa se o objeto da resposta tem o mesmo valor
        // Checagem não rigorosa com o .objectContaining
        expect(response).toEquals(
            expect.objectContaining({
                redirect: {
                    destination: '/'
                }
            })
        )
    })


})