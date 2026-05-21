"use client";

export function AboutSection() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-white px-8 relative overflow-hidden bg-gradient-to-br from-[#0c001a] via-[#14213d] to-[#000000]">
      {/* Premium Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#fca311]/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />

      <div className="max-w-3xl text-center z-10 space-y-6">
        <span className="text-[#fca311] font-mono tracking-widest text-sm uppercase">01 // About Me</span>
        <h2 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
          Crafting Premium Digital Experiences
        </h2>
        <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed">
          [Content undergoing styling & updates. Dynamic content will be revived here soon.]
        </p>
      </div>
    </div>
  );
}
