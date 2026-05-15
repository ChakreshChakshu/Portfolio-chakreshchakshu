import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      name: 'Chakresh Chakshu',
      role: 'Frontend Engineer (Full Stack Expertise)',
      stack: ['Next.js', 'React', 'TypeScript', 'GSAP'],
      bio: [
        "I’m a frontend engineer with full stack expertise focused on building modern, scalable, and performance-driven web experiences. I specialize in creating polished interfaces that combine clean architecture, intuitive user interactions, and thoughtful motion design using technologies like Next.js, React, TypeScript, and GSAP.",
        "My approach goes beyond writing functional code — I care deeply about how products feel, perform, and communicate with users. Whether it’s engineering responsive frontend systems, designing seamless user flows, or crafting immersive interactive experiences, I aim to build digital products that are both technically solid and visually refined.",
        "I’m continuously exploring modern frontend technologies, scalable UI systems, and advanced animation workflows to push the boundaries of web experiences while maintaining clean engineering practices and strong performance standards."
      ],
      status: 'Building the future of the web'
    },
    { status: 200 }
  );
}
