export const GUEST_CARD_CREATED_KEY = 'jinim_guest_card_created'
export const GUEST_CARD_URL_KEY = 'jinim_guest_card_url'
export const GUEST_CARD_SLUG_KEY = 'jinim_guest_card_slug'

export function saveGuestCardSession(cardUrl: string, shareSlug: string) {
  localStorage.setItem(GUEST_CARD_CREATED_KEY, 'true')
  localStorage.setItem(GUEST_CARD_URL_KEY, cardUrl)
  localStorage.setItem(GUEST_CARD_SLUG_KEY, shareSlug)
}

export function getGuestCardSession(): { cardUrl: string } | null {
  const created = localStorage.getItem(GUEST_CARD_CREATED_KEY) === 'true'
  const cardUrl = localStorage.getItem(GUEST_CARD_URL_KEY)
  if (created && cardUrl) {
    return { cardUrl }
  }
  return null
}
