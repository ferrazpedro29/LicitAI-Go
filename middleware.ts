// O supabase-js v2 armazena sessão em localStorage (não em cookies),
// então a verificação de auth deve ser feita no lado do cliente.
// O dashboard já protege a rota via supabase.auth.getUser() no useEffect.
// Este middleware é mantido como passthrough para futuras expansões.

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(_req: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}
