// Loading.tsx
export default function Loading() {
    return (
      <>
        {/* Inline styles for the background animation */}
        <style jsx>{`
          @keyframes pulseBg {
            0%, 100% {
              opacity: 0.5;
            }
            50% {
              opacity: 1;
            }
          }
        `}</style>
        <div className="fixed inset-0 flex items-center justify-center">
          {/* Animated background */}
          <div
            className="absolute inset-0 bg-black"
            style={{ animation: 'pulseBg 3s ease-in-out infinite' }}
          ></div>
          {/* Centered logo */}
          <div className="relative z-10">
            {/* <img src="/robo-face.svg" alt="Company Logo" className="w-40 h-40" />
             */}
             <span>Loading...</span>
          </div>
        </div>
      </>
    );
  }
  