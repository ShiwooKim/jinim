import { randomUUID } from 'crypto'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

const BUCKET = 'jinim-card-images'
const MAX_TEXT_LENGTH = 500
const MAX_IMAGE_BYTES = 5 * 1024 * 1024

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp'])

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ ok: false, error: message }, { status })
}

function requireTrimmedText(
  value: FormDataEntryValue | null,
  label: string,
): { ok: true; value: string } | { ok: false; error: string } {
  if (typeof value !== 'string') {
    return { ok: false, error: `${label}은(는) 필수입니다.` }
  }
  const trimmed = value.trim()
  if (trimmed.length < 1) {
    return { ok: false, error: `${label}은(는) 필수입니다.` }
  }
  if (trimmed.length > MAX_TEXT_LENGTH) {
    return { ok: false, error: `${label}은(는) ${MAX_TEXT_LENGTH}자 이하여야 합니다.` }
  }
  return { ok: true, value: trimmed }
}

function optionalTrimmedText(
  value: FormDataEntryValue | null,
): string | null {
  if (value == null || typeof value !== 'string') return null
  const trimmed = value.trim()
  if (trimmed.length === 0) return null
  if (trimmed.length > MAX_TEXT_LENGTH) return null
  return trimmed
}

async function removeUploadedImage(imagePath: string) {
  const { error } = await supabaseAdmin.storage.from(BUCKET).remove([imagePath])
  if (error) {
    console.error('Failed to remove uploaded image after rollback:', error.message)
  }
}

export async function POST(request: Request) {
  let uploadedImagePath: string | null = null

  try {
    const formData = await request.formData()

    const image = formData.get('image')
    if (!(image instanceof File) || image.size === 0) {
      return jsonError('이미지 파일이 필요합니다.', 400)
    }

    if (!ALLOWED_MIME.has(image.type)) {
      return jsonError('허용되지 않는 이미지 형식입니다. (jpeg, png, webp)', 400)
    }

    if (image.size > MAX_IMAGE_BYTES) {
      return jsonError('이미지 크기는 5MB 이하여야 합니다.', 400)
    }

    const objectNameResult = requireTrimmedText(formData.get('objectName'), '물건 이름')
    if (!objectNameResult.ok) {
      return jsonError(objectNameResult.error, 400)
    }

    const categoryResult = requireTrimmedText(formData.get('category'), '카테고리')
    if (!categoryResult.ok) {
      return jsonError(categoryResult.error, 400)
    }

    const answerWhatResult = requireTrimmedText(
      formData.get('answerWhatIsIt'),
      '첫 번째 답변',
    )
    if (!answerWhatResult.ok) {
      return jsonError(answerWhatResult.error, 400)
    }

    const answerKeepResult = requireTrimmedText(
      formData.get('answerWhyKeepIt'),
      '두 번째 답변',
    )
    if (!answerKeepResult.ok) {
      return jsonError(answerKeepResult.error, 400)
    }

    const answerContinueResult = requireTrimmedText(
      formData.get('answerWhyContinue'),
      '세 번째 답변',
    )
    if (!answerContinueResult.ok) {
      return jsonError(answerContinueResult.error, 400)
    }

    const objectNicknameRaw = formData.get('objectNickname')
    if (objectNicknameRaw != null && typeof objectNicknameRaw !== 'string') {
      return jsonError('별명 형식이 올바르지 않습니다.', 400)
    }
    const objectNickname = optionalTrimmedText(objectNicknameRaw)
    if (
      typeof objectNicknameRaw === 'string' &&
      objectNicknameRaw.trim().length > 0 &&
      objectNickname === null
    ) {
      return jsonError(
        `별명은 ${MAX_TEXT_LENGTH}자 이하여야 합니다.`,
        400,
      )
    }

    const objectName = objectNameResult.value
    const category = categoryResult.value
    const answerWhatIsIt = answerWhatResult.value
    const answerWhyKeepIt = answerKeepResult.value
    const answerWhyContinue = answerContinueResult.value

    const guestToken = randomUUID()
    const cardId = randomUUID()
    const shareSlug = `c-${randomUUID().slice(0, 8)}`
    const ext = MIME_TO_EXT[image.type]!
    const imagePath = `guest/${guestToken}/${cardId}.${ext}`

    const imageBuffer = Buffer.from(await image.arrayBuffer())

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(imagePath, imageBuffer, {
        contentType: image.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Storage upload failed:', uploadError.message)
      return jsonError('지님 카드를 생성하지 못했습니다.', 500)
    }

    uploadedImagePath = imagePath

    const { error: cardError } = await supabaseAdmin.from('jinim_cards').insert({
      id: cardId,
      user_id: null,
      collection_id: null,
      guest_token: guestToken,
      share_slug: shareSlug,
      status: 'published',
      visibility: 'link_only',
      category,
      object_name: objectName,
      object_nickname: objectNickname,
      image_path: imagePath,
      image_url: null,
      title: `${objectName}의 지님 카드`,
      role_text: null,
      reason_text: answerWhyKeepIt,
      value_text: answerWhyContinue,
      tags: [],
      taste_summary: null,
      is_guest_created: true,
    })

    if (cardError) {
      console.error('jinim_cards insert failed:', cardError.message)
      if (uploadedImagePath) {
        await removeUploadedImage(uploadedImagePath)
      }
      return jsonError('지님 카드를 생성하지 못했습니다.', 500)
    }

    const { error: answersError } = await supabaseAdmin.from('card_answers').insert([
      {
        card_id: cardId,
        question_key: 'what_is_it',
        question_text: '이 물건은 무엇인가요?',
        answer_text: answerWhatIsIt,
        sort_order: 1,
      },
      {
        card_id: cardId,
        question_key: 'why_keep_it',
        question_text: '왜 아직도 지니고 있나요?',
        answer_text: answerWhyKeepIt,
        sort_order: 2,
      },
      {
        card_id: cardId,
        question_key: 'why_continue',
        question_text: '앞으로도 계속 지니고 싶은 이유가 있나요?',
        answer_text: answerWhyContinue,
        sort_order: 3,
      },
    ])

    if (answersError) {
      console.error('card_answers insert failed:', answersError.message)
      await supabaseAdmin.from('jinim_cards').delete().eq('id', cardId)
      if (uploadedImagePath) {
        await removeUploadedImage(uploadedImagePath)
      }
      return jsonError('지님 카드를 생성하지 못했습니다.', 500)
    }

    const { error: reportError } = await supabaseAdmin.from('taste_reports').insert({
      user_id: null,
      collection_id: null,
      card_id: cardId,
      guest_token: guestToken,
      scope: 'guest_single',
      summary:
        '이 물건에는 오래 곁에 둔 것에서 안정감과 의미를 찾는 취향이 담겨 있습니다.',
      keywords: ['오래감', '의미', '일상'],
      selection_criteria:
        '비싸거나 화려한 것보다, 오래 지니고 싶은 이유가 있는 물건을 중요하게 여깁니다.',
      mood_text: null,
      suggested_items: {
        items: ['오래 쓰는 지갑', '손에 익은 펜', '자주 들고 다니는 가방'],
      },
      source_card_ids: [cardId],
    })

    if (reportError) {
      console.error('taste_reports insert failed:', reportError.message)
      await supabaseAdmin.from('card_answers').delete().eq('card_id', cardId)
      await supabaseAdmin.from('jinim_cards').delete().eq('id', cardId)
      if (uploadedImagePath) {
        await removeUploadedImage(uploadedImagePath)
      }
      return jsonError('지님 카드를 생성하지 못했습니다.', 500)
    }

    return NextResponse.json({
      ok: true,
      cardId,
      shareSlug,
      cardUrl: `/c/${shareSlug}`,
    })
  } catch (err) {
    console.error(
      'Guest card creation failed:',
      err instanceof Error ? err.message : 'unknown error',
    )
    if (uploadedImagePath) {
      await removeUploadedImage(uploadedImagePath)
    }
    return jsonError('지님 카드를 생성하지 못했습니다.', 500)
  }
}
