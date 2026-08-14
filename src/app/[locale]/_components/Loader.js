import Image from "next/image";

const Loader = ({ className = "min-h-[60vh]" }) => {
  return (
    <div className={`flex items-center justify-center ${className} bg-transparent`}>
      <div className="relative flex flex-col items-center justify-center">
        {/* Subtle radial ambient glow matching brand color */}
        <div className="absolute w-24 h-24 bg-main/20 rounded-full blur-2xl pointer-events-none" />

        {/* Animated Brand Logo Loader */}
        <Image
          src="/logos/Loading-ezgif.com-crop.svg"
          alt="Loading..."
          width={84}
          height={84}
          unoptimized
          priority
          className="relative z-10 w-20 h-20 object-contain drop-shadow-[0_0_15px_rgba(215,177,128,0.3)]"
        />
      </div>
    </div>
  );
};

export default Loader;
