import {draftMode} from 'next/headers'
import {NextResponse} from 'next/server'

export async function GET(request: Request) {
  const dm = await draftMode()
  dm.disable()

  const {searchParams} = new URL(request.url)
  const redirect = searchParams.get('redirect') ?? '/'
  return NextResponse.redirect(new URL(redirect, request.url))
}