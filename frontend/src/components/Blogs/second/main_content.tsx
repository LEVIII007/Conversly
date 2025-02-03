import React from "react";
import Image from "next/image";

export function BlogContent() {
  return (
    <section id="mainContent" className="bg-white py-16">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg">
        <h2 className="text-3xl font-bold mb-8">How to Create and Deploy a Chatbot on Your Website in Minutes!</h2>

        <p className="mb-6">
          Building a chatbot for your website has never been easier! With Conversly.ai, you can create and deploy a fully functional chatbot in just a few minutes. Follow this simple guide to get started:
        </p>

        {/* Other Content */}

        <h2 className="text-3xl font-bold mb-8 mt-12">Example Implementation (React)</h2>
        <p className="mb-6">Here’s how you can implement the chatbot on a React-based website:</p>

        <div className="relative border rounded-lg max-w-[1000px]">
          <div className="overflow-x-auto">
            <Image
              src="/code-snippet.png"
              alt="React chatbot implementation"
              width={1000}
              height={500}
              className="rounded-lg"
              priority
            />
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-8 mt-12">Congratulations! 🎉</h2>
        <p className="mb-6">
          That’s it! Your website now has a fully functional chatbot powered by Conversly.ai. Engage with visitors, answer queries instantly, and enhance the user experience effortlessly.
        </p>

        <div className="bg-neutral-900 text-white p-8 rounded-lg text-center">
          <p className="text-xl font-semibold mb-4">Ready to create your chatbot?</p>
          <a
            href="https://conversly.shashankkk.site"
            className="inline-block bg-white text-neutral-900 px-8 py-3 rounded-full font-semibold hover:bg-neutral-100 transition-colors"
          >
            Start with Conversly.ai today
          </a>
        </div>
      </article>
    </section>
  );
}
