import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getMe } from '../lib/users';
import { getArticles } from '../lib/articles';
import { useSession, signIn, signOut } from 'next-auth/react';

export async function getServerSideProps() {
  const allArticlesData = await getArticles();
  return {
    props: {
      allArticlesData
    }
  };
}

export default function IndexPage({ allArticlesData }) {
  const { data: session, status } = useSession();

  const isLoading = status === 'loading';
  if (isLoading) return 'Loading...';

  if (session) {
    console.log('session.user:', session.user);

    return (
      <>
        Signed in as {session.user.email}{' '}
        <span className='bg-gray-200 rounded p-1'>{session.user?.role}</span>
        <br />
        {/* JWT token: {session.user.jwt}<br /> */}
        <button onClick={() => signOut()}>Sign out</button>
        <h1>Authoring Site (Next.js)</h1>
        <Link href='/articles/new'>New Article</Link>
        <ul>
          {allArticlesData.data.map(article => {
            return (
              <li key={article.id} className='mb-5'>
                <Link href={`/articles/${article.id}`}>
                  <strong>{article.attributes.title}</strong>
                  <br />
                  {article.attributes.body.slice(0, 150)}...
                </Link>
              </li>
            );
          })}
        </ul>
      </>
    );
  }

  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}