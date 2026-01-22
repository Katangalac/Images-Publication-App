import Head from "next/head";

/**
 * Page About
 */
export default function About() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-6">
          <Head>
            <title>About - Ugram</title>
            <meta name="description" content="Description de Ugram" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
    
          <main className="flex flex-col items-start justify-start w-full flex-1 px-20 text-center">
            <h1 className="text-3xl font-bold text-indigo-600">
              About us
            </h1>
            <p className="mt-4 text-xl">
              Welcome to <b>UImages</b>,
            </p>
            <p className="mt-4 text-lg text-justify">
                We are building a platform where creativity and expression come together.
                Our app allows users to share images, discover inspiring content, and connect through visual storytelling.
                Our goal is to provide a simple, fast, and enjoyable experience for publishing, exploring, and interacting with images. We focus on usability, performance, and a clean design to let the content speak for itself.
                Whether you’re sharing your own creations or discovering those of others, our platform is designed to make visual interaction seamless and engaging.
            </p>
          </main>
    
          <footer className="w-full h-24 flex justify-center items-center border-t">
            <a
              className="text-blue-600 hover:text-blue-800"
              href="/"
              target="_blank"
              rel="noopener noreferrer"
            >
              UImages - All right reserved
            </a>
          </footer>
        </div>
      );
}