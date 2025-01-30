const NavigationButtons = () => {
  return (
    <section id="navigationButtons" className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center transition-opacity duration-500 opacity-100 translate-y-0">
          <NavButton
            href="#"
            direction="left"
            title="Previous Article:"
            subtitle="The Evolution of Customer Service"
          />

          {/* Centered Scroll to Top Button */}
          <div className="hidden md:flex justify-center">
            <a
              href="#hero"
              aria-label="Scroll to top"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            </a>
          </div>

          <NavButton
            href="#"
            direction="right"
            title="Next Article:"
            subtitle="Future of AI in Business"
          />
        </div>
      </div>
    </section>
  );
};

type NavButtonProps = {
  href: string;
  direction: "left" | "right";
  title: string;
  subtitle: string;
};

const NavButton = ({ href, direction, title, subtitle }: NavButtonProps) => {
  return (
    <a
      href={href}
      className={`group flex items-center gap-3 px-6 py-3 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors ${
        direction === "right" ? "text-right flex-row-reverse" : ""
      }`}
    >
      <svg
        className="w-5 h-5 text-gray-600 group-hover:text-gray-800"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d={direction === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
        />
      </svg>
      <span className="text-gray-600 group-hover:text-gray-800 font-medium">
        {title}
        <span className="block text-sm text-gray-500">{subtitle}</span>
      </span>
    </a>
  );
};

export default NavigationButtons;
