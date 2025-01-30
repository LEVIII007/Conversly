import React from "react";

export function BlogContent() {
  return (
    <section id="mainContent" className="bg-white py-16">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg">
        <h2 className="text-3xl font-bold mb-8 animate__animated animate__fadeIn">
          1. Mastering Prompt Engineering
        </h2>
        <p className="mb-6">
          Prompt engineering is the foundation of a high-performing chatbot. The
          way you structure prompts directly impacts the quality of responses.
          Here are some best practices:
        </p>
        <ul className="space-y-4 mb-8">
          <li>
            <strong>Be Clear and Concise</strong>: Instead of vague prompts, use
            direct and specific instructions. Example:
            <ul className="pl-6">
              <li className="text-red-500">❌ "Tell me about shipping."</li>
              <li className="text-green-500">
                ✅ "What are the shipping policies for international customers?"
              </li>
            </ul>
          </li>
          <li>
            <strong>Use Contextual Prompts</strong>: Provide background
            information to guide responses.
            <ul className="pl-6">
              <li className="text-green-500">
                ✅ "A customer wants to return an item. What steps should they
                follow based on our store policy?"
              </li>
            </ul>
          </li>
        </ul>

        <h2 className="text-3xl font-bold mb-8 mt-12">
          2. Choosing and Formatting the Right Knowledge Base
        </h2>
        <p className="mb-6">
          A chatbot's accuracy depends on its knowledge base. Conversly.ai
          allows integration with various data sources, so selecting and
          formatting information correctly is crucial.
        </p>
        <h3 className="text-2xl font-semibold mb-4">Choosing the Right Knowledge Base:</h3>
        <ul className="space-y-2 mb-8">
          <li>
            <strong>Frequently Asked Questions (FAQs):</strong> Ideal for
            answering common customer queries.
          </li>
          <li>
            <strong>Help Center or Documentation:</strong> Use structured guides
            for troubleshooting and policy-related responses.
          </li>
          <li>
            <strong>Product Catalogs & Inventory Data:</strong> Ensure real-time
            updates for product-related inquiries.
          </li>
          <li>
            <strong>Company Policies & Compliance Docs:</strong> Ensure the
            chatbot provides legally accurate responses.
          </li>
        </ul>

        <h2 className="text-3xl font-bold mb-8 mt-12">
          3. Understanding the Do's and Don'ts of Chatbot Optimization
        </h2>
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">✅ Do's:</h3>
            <ul className="space-y-2">
              <li>
                ✔ <strong>Test Conversations Frequently:</strong> Use real-world
                scenarios to refine responses.
              </li>
              <li>
                ✔ <strong>Ensure a Seamless Handoff:</strong> Smoothly
                transition users to support staff.
              </li>
              <li>
                ✔ <strong>Provide Natural Language:</strong> Use conversational
                language rather than robotic text.
              </li>
            </ul>
          </div>
          <div className="bg-red-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">❌ Don'ts:</h3>
            <ul className="space-y-2">
              <li>❌ <strong>Don't Overpromise:</strong> Ensure realistic expectations.</li>
              <li>❌ <strong>Don't Ignore Feedback:</strong> Update knowledge base based on user queries.</li>
              <li>❌ <strong>Don't Make It Long:</strong> Users prefer quick, efficient responses.</li>
            </ul>
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-8">4. The Importance of Citations for Credibility</h2>
        <p className="mb-6">
          A trustworthy chatbot should cite sources where necessary, especially
          for:
        </p>
        <ul className="space-y-2 mb-8">
          <li>
            <strong>Legal or Policy-Related Queries</strong> (e.g., "Return
            policies based on company guidelines found here: [link]")
          </li>
          <li>
            <strong>Medical or Financial Information</strong> (e.g., "This
            information is sourced from the CDC website: [link]")
          </li>
          <li>
            <strong>Product Specs or Availability</strong> (e.g., "As per our
            latest catalog update: [link]")
          </li>
        </ul>

        <div className="border-t border-gray-200 pt-8 mt-12">
          <h2 className="text-3xl font-bold mb-6">Final Thoughts</h2>
          <p className="mb-8">
            Creating an optimized chatbot with Conversly.ai is not just about
            setting it up—it's about fine-tuning prompts, choosing the right
            knowledge base, following best practices, and ensuring reliability
            through citations. By implementing these strategies, you can build a
            chatbot that enhances customer experience, reduces support costs,
            and improves engagement.
          </p>
            <div className="bg-neutral-900 text-white p-8 rounded-lg text-center">
            <p className="text-xl font-semibold mb-4">Ready to optimize your chatbot?</p>
            <a
              href="/"
              className="inline-block bg-white text-neutral-900 px-8 py-3 rounded-full font-semibold hover:bg-neutral-100 transition-colors"
            >
              Start with Conversly.ai today
            </a>
            </div>
        </div>
      </article>
    </section>
  );
}
