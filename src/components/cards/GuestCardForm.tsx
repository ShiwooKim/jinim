'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { saveGuestCardSession } from '@/lib/guest-card-storage'

const CATEGORIES = [
  '시계',
  '지갑',
  '펜/문구',
  '가방',
  '안경',
  '카메라',
  '키링',
  '노트',
  '기타',
] as const

const MAX_TEXT_LENGTH = 500
const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp'])

type GuestCardSuccess = {
  ok: true
  cardId: string
  shareSlug: string
  cardUrl: string
}

type GuestCardFailure = {
  ok: false
  error?: string
}

function validateText(value: string, label: string): string | null {
  const trimmed = value.trim()
  if (trimmed.length < 1) return `${label}을(를) 입력해주세요.`
  if (trimmed.length > MAX_TEXT_LENGTH) {
    return `${label}은(는) ${MAX_TEXT_LENGTH}자 이하여야 합니다.`
  }
  return null
}

function validateImage(file: File | null): string | null {
  if (!file || file.size === 0) return '이미지를 선택해주세요.'
  if (!ALLOWED_MIME.has(file.type)) {
    return 'jpg, png, webp 형식의 이미지만 업로드할 수 있습니다.'
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return '이미지 크기는 5MB 이하여야 합니다.'
  }
  return null
}

const inputClass =
  'w-full rounded-2xl border border-[#DDD2C4] bg-white/80 px-4 py-3 text-sm text-[#2B2926] placeholder:text-[#2B2926]/40 outline-none transition focus:border-[#7A624C] focus:ring-2 focus:ring-[#7A624C]/15'

export function GuestCardForm() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [image, setImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [objectName, setObjectName] = useState('')
  const [category, setCategory] = useState('')
  const [answerWhatIsIt, setAnswerWhatIsIt] = useState('')
  const [answerWhyKeepIt, setAnswerWhyKeepIt] = useState('')
  const [answerWhyContinue, setAnswerWhyContinue] = useState('')

  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!image) {
      setPreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(image)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [image])

  const isFormComplete =
    image != null &&
    objectName.trim().length > 0 &&
    category.length > 0 &&
    answerWhatIsIt.trim().length > 0 &&
    answerWhyKeepIt.trim().length > 0 &&
    answerWhyContinue.trim().length > 0

  function handleImageChange(file: File | null) {
    if (!file) {
      setImage(null)
      return
    }
    const imageError = validateImage(file)
    if (imageError) {
      setError(imageError)
      setImage(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }
    setError(null)
    setImage(file)
  }

  function validateForm(): string | null {
    const imageError = validateImage(image)
    if (imageError) return imageError

    const objectNameError = validateText(objectName, '물건 이름')
    if (objectNameError) return objectNameError

    if (!category) return '카테고리를 선택해주세요.'

    const q1 = validateText(answerWhatIsIt, '첫 번째 답변')
    if (q1) return q1

    const q2 = validateText(answerWhyKeepIt, '두 번째 답변')
    if (q2) return q2

    const q3 = validateText(answerWhyContinue, '세 번째 답변')
    if (q3) return q3

    return null
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    if (!image) return

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('image', image)
      formData.append('objectName', objectName.trim())
      formData.append('category', category)
      formData.append('answerWhatIsIt', answerWhatIsIt.trim())
      formData.append('answerWhyKeepIt', answerWhyKeepIt.trim())
      formData.append('answerWhyContinue', answerWhyContinue.trim())

      const res = await fetch('/api/cards/guest', {
        method: 'POST',
        body: formData,
      })

      const data = (await res.json()) as GuestCardSuccess | GuestCardFailure

      if (!res.ok || !data.ok) {
        setError(
          data.ok === false && data.error
            ? data.error
            : '지님 카드를 만들지 못했습니다. 잠시 후 다시 시도해주세요.',
        )
        return
      }

      saveGuestCardSession(data.cardUrl, data.shareSlug)
      router.push(data.cardUrl)
    } catch {
      setError('지님 카드를 만들지 못했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-3xl border border-[#DDD2C4] bg-white/50 p-6 shadow-[0_8px_28px_-14px_rgba(43,41,38,0.1)] sm:p-8"
    >
      {error ? (
        <p
          role="alert"
          className="rounded-2xl border border-red-200/80 bg-red-50/80 px-4 py-3 text-sm text-red-800"
        >
          {error}
        </p>
      ) : null}

      <div className="space-y-3">
        <label className="block text-sm font-medium text-[#4A3B30]">
          물건 사진 <span className="text-[#7A624C]">*</span>
        </label>
        <div className="overflow-hidden rounded-2xl border border-dashed border-[#DDD2C4] bg-[#F5F1EA]/60">
          {previewUrl ? (
            <div className="relative aspect-[4/3] w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="선택한 물건 사진 미리보기"
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex aspect-[4/3] flex-col items-center justify-center gap-2 px-4 text-center text-sm text-[#7A624C]/80">
              <span>jpg, png, webp · 최대 5MB</span>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="block w-full text-sm text-[#2B2926] file:mr-4 file:rounded-xl file:border-0 file:bg-[#7A624C] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[#F5F1EA] hover:file:bg-[#4A3B30]"
          onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="objectName" className="block text-sm font-medium text-[#4A3B30]">
          이 물건은 무엇인가요? <span className="text-[#7A624C]">*</span>
        </label>
        <input
          id="objectName"
          name="objectName"
          type="text"
          value={objectName}
          onChange={(e) => setObjectName(e.target.value)}
          placeholder="예: 카시오 F-91W, 오래 쓰는 지갑, 손에 익은 펜"
          className={inputClass}
          maxLength={MAX_TEXT_LENGTH}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="category" className="block text-sm font-medium text-[#4A3B30]">
          카테고리 <span className="text-[#7A624C]">*</span>
        </label>
        <select
          id="category"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={inputClass}
          disabled={isSubmitting}
        >
          <option value="">선택해주세요</option>
          {CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="answerWhatIsIt" className="block text-sm font-medium text-[#4A3B30]">
          이 물건은 어떤 물건인가요? <span className="text-[#7A624C]">*</span>
        </label>
        <textarea
          id="answerWhatIsIt"
          name="answerWhatIsIt"
          value={answerWhatIsIt}
          onChange={(e) => setAnswerWhatIsIt(e.target.value)}
          placeholder="짧게 적어도 괜찮아요."
          rows={3}
          className={`${inputClass} resize-y min-h-[5rem]`}
          maxLength={MAX_TEXT_LENGTH}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="answerWhyKeepIt" className="block text-sm font-medium text-[#4A3B30]">
          왜 아직도 지니고 있나요? <span className="text-[#7A624C]">*</span>
        </label>
        <textarea
          id="answerWhyKeepIt"
          name="answerWhyKeepIt"
          value={answerWhyKeepIt}
          onChange={(e) => setAnswerWhyKeepIt(e.target.value)}
          placeholder="비싸지 않아도, 오래 지닌 이유가 있다면 충분합니다."
          rows={3}
          className={`${inputClass} resize-y min-h-[5rem]`}
          maxLength={MAX_TEXT_LENGTH}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="answerWhyContinue" className="block text-sm font-medium text-[#4A3B30]">
          앞으로도 계속 지니고 싶은 이유가 있나요?{' '}
          <span className="text-[#7A624C]">*</span>
        </label>
        <textarea
          id="answerWhyContinue"
          name="answerWhyContinue"
          value={answerWhyContinue}
          onChange={(e) => setAnswerWhyContinue(e.target.value)}
          placeholder="이 물건을 계속 곁에 두고 싶은 이유를 남겨주세요."
          rows={3}
          className={`${inputClass} resize-y min-h-[5rem]`}
          maxLength={MAX_TEXT_LENGTH}
          disabled={isSubmitting}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !isFormComplete}
        className="w-full rounded-2xl border border-[#7A624C] bg-[#7A624C] px-6 py-3.5 text-sm font-medium text-[#F5F1EA] transition hover:bg-[#4A3B30] hover:border-[#4A3B30] disabled:cursor-not-allowed disabled:border-[#DDD2C4] disabled:bg-[#DDD2C4]/60 disabled:text-[#2B2926]/50"
      >
        {isSubmitting ? '지님 카드를 만들고 있어요...' : '지님 카드 만들기'}
      </button>
    </form>
  )
}
