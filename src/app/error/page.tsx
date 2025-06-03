'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

// Separate the main content into its own component
const ErrorContent = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams(); // Get search parameters from the URL

  useEffect(() => {
    const error = searchParams.get('errorMessage'); // Extract the error message
    if (error) {
      setErrorMessage(decodeURIComponent(error)); // Decode the message
    }
  }, [searchParams]);

  return (
    <div>
      <h1>Error</h1>
      {errorMessage ? (
        <p>{errorMessage}</p>
      ) : (
        <p>An unknown error occurred.</p>
      )}
      <button onClick={() => router.push('/auth/login')}>Go back to Login</button>
    </div>
  );
};

// Main page component with Suspense
const ErrorPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
};

export default ErrorPage;
