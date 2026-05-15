import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      name: 'Chakresh Chakshu',
      role: 'Frontend Engineer with full stack expertise',
      focus: ['Next.js', 'React', 'TypeScript', 'GSAP', 'Tailwind CSS'],
      description: 'Crafting modern web experiences with clean code, fluid motion, and polished UI.',
      status: 'Ready for new opportunities'
    },
    { status: 200 }
  );
}
