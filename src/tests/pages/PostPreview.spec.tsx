import { render, screen } from '@testing-library/react';
import Post, { getStaticProps } from '../../pages/posts/preview/[slug]';
import { mocked } from 'ts-jest/cli';
import { getPrismicClient } from '../../Services/prismic'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const post = 
    {
        slug: 'my-new-posts',
        title: 'My New Post',
        content: '<p>Post exercpt</p>',
        updatedAt: '10 de april'
    }

jest.mock('next-auth/react');
jest.mock('next/router');
jest.mock('../../services/prismic');

describe('Posts preview page', () => {
    it('renders correctly', () => {
        const useSessionMocked = mocked(useSession);

        useSessionMocked.mockReturnValueOnce([null, false]);

        render(
            <Post post={post} />
        )

        expect(screen.getByText('My New Post')).toBeInDocument()
        expect(screen.getByText('Post excerpt')).toBeInDocument()
        expect(screen.getByText('Wanna continue reading?')).toBeInDocument()
        
    });

    it('redirects user to full post when user is subscribed', async () => {
        const useSessionMocked = mocked(useSession);
        const useRouterMocked = mocked(useRouter);
        const pushMock = jest.fn();

        useSessionMocked.mockReturnValueOnce(
            [   { activeSubscription : 'fake-subscription' },
            ]
        )

        useRouterMocked.mockReturnValueOnce({
            push : pushMock
        } as any)

        render(<Post post={post}/>)

        expect(pushMock).toHaveBeenCalledWith('/posts/my-new-post')
    })

    it('loads initial data', async () => {
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


        const response = await getStaticProps({
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