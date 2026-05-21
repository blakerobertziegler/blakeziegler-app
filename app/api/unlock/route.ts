import { NextRequest, NextResponse } from 'next/server';
import { getProject } from '@/lib/projects';
import { createHash } from 'crypto';

const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, password } = body as { slug?: string; password?: string };

    if (!slug || typeof slug !== 'string') {
      return NextResponse.json({ success: false, message: 'Missing slug.' }, { status: 400 });
    }
    if (!password || typeof password !== 'string') {
      return NextResponse.json({ success: false, message: 'Missing password.' }, { status: 400 });
    }

    const project = getProject(slug);
    if (!project) {
      return NextResponse.json({ success: false, message: 'Project not found.' }, { status: 404 });
    }
    if (!project.locked || !project.passwordHashEnvVar) {
      return NextResponse.json({ success: true });
    }

    const expectedHash = process.env[project.passwordHashEnvVar];
    if (!expectedHash) {
      if (process.env.NODE_ENV === 'development') {
        const res = NextResponse.json({ success: true });
        res.cookies.set(`unlocked_${slug}`, '1', {
          httpOnly: true,
          sameSite: 'lax',
          path: `/work/${slug}`,
          maxAge: COOKIE_MAX_AGE,
        });
        return res;
      }
      return NextResponse.json({ success: false, message: 'Access unavailable.' }, { status: 503 });
    }

    const submitted = createHash('sha256').update(password.trim()).digest('hex');
    const match = submitted === expectedHash.toLowerCase();

    if (!match) {
      return NextResponse.json({ success: false, message: 'Incorrect password.' }, { status: 401 });
    }

    const res = NextResponse.json({ success: true });
    res.cookies.set(`unlocked_${slug}`, '1', {
      httpOnly: true,
      sameSite: 'lax',
      path: `/work/${slug}`,
      maxAge: COOKIE_MAX_AGE,
    });
    return res;
  } catch {
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}
