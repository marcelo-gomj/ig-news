import { render, screen } from '@testing-library/react';
import Posts, { getStaticProps } from '../../pages/posts';
import { mocked } from 'ts-jest/cli';
import { getPrismicClient } from '../../Services/prismic'

const posts = [
    {
        slug: 'my-new-posts',
        title: 'My New Post',
        excerpt: 'Post exercpt',
        updatedAt: '10 de april'
    }
]

jest.mock('../../services/prismic');

describe('Posts page', () => {
    it('renders correctly', () => {
        render(
            <Posts posts={posts} />
        )

        expect(screen.getByText('My New Post')).toBeInDocument()
    });

    it('loads initial data', async () => {
        const getPrismicClientMocked = mocked(getPrismicClient);

        getPrismicClientMocked.mockReturnValueOnce({
            query: jest.fn().mockResolvedValueOnce({
                results: [{
                    uid: 'my-new-post',
                    data: {
                        title: [{ type: 'heading', text: 'My new post' }],
                        content: [
                            { type: 'paragraph', text: 'Post excerpt' }
                        ]
                    },
                    last_publication_date: '04-01-2021'
                }]
            })
        } as any)

        const response = await getStaticProps({});

        // Checa se o objeto da resposta tem o mesmo valor
        // Checagem não rigorosa com o .objectContaining
        expect(response).toEquals(
            expect.objectContaining({
                props: {
                    posts: {
                        slug : 'my-new-post',
                        title : 'My new post',
                        excerpt: 'Post excerpt',
                        updatedAt : ''
                    }
                }
            })
        )
    })


})