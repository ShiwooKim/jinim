'use client'

import { useEffect, useState } from 'react'
import { getGuestCardSession } from '@/lib/guest-card-storage'
import { GuestCardCreatedNotice } from '@/components/cards/GuestCardCreatedNotice'
import { GuestCardForm } from '@/components/cards/GuestCardForm'

export function NewCardContent() {
  const [cardUrl, setCardUrl] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const session = getGuestCardSession()
    setCardUrl(session?.cardUrl ?? null)
    setReady(true)
  }, [])

  if (!ready) {
    return (
      <div
        className="rounded-3xl border border-[#DDD2C4] bg-white/40 p-8 text-center text-sm text-[#7A624C]/80"
        aria-hidden
      >
        불러오는 중…
      </div>
    )
  }

  if (cardUrl) {
    return <GuestCardCreatedNotice cardUrl={cardUrl} />
  }

  return <GuestCardForm />
}
