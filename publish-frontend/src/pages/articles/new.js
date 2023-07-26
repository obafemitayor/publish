import { useSession } from "next-auth/react";
import React, { useState } from "react";
import Link from 'next/link'
import ArticleForm from "@/components/article-form";
import { createArticle } from 'src/lib/articles';

export default function NewArticlePage() {
  // Get auth data from the session
  const { data: session } = useSession();
  // declare state variable `content`
  const [content, setContent] = useState('');

  const handleContentChange = updatedContent => {
    setContent(updatedContent);
  };

  // Handles the submit event on form submit.
  const handleSubmit = async (event, session) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    // Construct the data to be sent to the server
    const data = {
      // Need to nest in data object because Strapi expects so
      data: {
        title: event.target.title.value,
        body: content // Get the content from the state
      }
    };

    // Data to send to the Strapi server in JSON format.
    const JSONdata = JSON.stringify(data);

    // Bearer token for authentication
    const token = session.user.jwt;

    try {
      const result = await createArticle(JSONdata, token);
      console.log('createArticle response: ', JSON.stringify(result));
      alert('Saved!');
    } catch (error) {
      console.error('createArticle Error:', error);
      alert('Failed to save the article');
    }
  };

  return (
    <>
      {/* // We pass the event to the handleSubmit() function on submit. */}
      <ArticleForm
        onSubmit={event => handleSubmit(event, session)}
        initialValues={{ title: '', body: '' }}
        onContentChange={handleContentChange}
      />

      <Link href='/'>Home</Link>
    </>
  );
}