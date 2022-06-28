import { render, screen } from '@testing-library/react';
import Post, { getServerSideProps } from '../../pages/posts/[slug]';
import { mocked } from 'ts-jest/cli';
import { getPrismicClient } from '../../Services/prismic'
import { getSession } from 'next-auth/react';
import JSDOMEnvironment from 'jest-environment-jsdom';

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
        const getSessionMocked = mocked(getSession);
        getSessionMocked.mockResolvedValueOnce(null); 

        const response = await getServerSideProps({
            params : { slug : 'my-new-post' }
        } as any);

        // Checa se o objeto da resposta tem o mesmo valor
        // Checagem não rigorosa com o .objectContaining
        expect(response).toEquals(
            expect.objectContaining({
                redirect: expect.objectContaining({
                    destination: '/'
                })
            })
        )
    })

    it('loads initial data', async () => {
        const getSessionMocked = mocked(getSession);
        const getPrismicClientMocked = mocked(getPrismicClient);

        getPrismicClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValue({
                data : {
                    title: [{ type: 'heading', text : 'My new post'}],
                    content: [{ type: 'paragraph', text : 'Post excerpt'}],
                },
                last_publication_date : '04-01-2022' 
            })
        } as any)

        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: 'fake-active-subscription'
        } as any );

        const response = await getServerSideProps({
            params : { slug : 'my-new-post' }
        } as any);

        // Checa se o objeto da resposta tem o mesmo valor
        // Checagem não rigorosa com o .objectContaining
        expect(response).toEquals(
            expect.objectContaining({
                props : {
                    post: {
                        slug :  'my-new-post', 
                        title : 'My new post',
                        content : '<p>Post content</p>',
                        updatedAt: '01 de abril de 2022'
                    }
                }
            })
        )
      
    })

})