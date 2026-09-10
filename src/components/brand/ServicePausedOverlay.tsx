/**
 * 서비스 보류용 전역 오버레이.
 * 루트 레이아웃에 마운트되어 모든 경로에서 동일하게 표시된다.
 * 닫기 버튼 없음 — 방향성 확정 전까지 사이트 접근을 막는다.
 */
export function ServicePausedOverlay() {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-paused-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
    >
      {/* dim + soft radial atmosphere */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[#2B2926]/45 backdrop-blur-[2px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(245,241,234,0.22), transparent 70%)",
        }}
      />

      <div
        className="service-paused-panel relative w-full max-w-[26rem] overflow-hidden rounded-[28px] border border-[#DDD2C4]/90 bg-[#F5F1EA] px-8 py-10 text-center shadow-[0_24px_60px_-20px_rgba(43,41,38,0.45)] sm:px-10 sm:py-12"
      >
        {/* paper wash */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-80"
          style={{
            background:
              "radial-gradient(ellipse 120% 90% at 50% -10%, rgba(122,98,76,0.08), transparent 55%)",
          }}
        />

        <div className="relative space-y-6">
          <p className="text-[0.7rem] font-medium tracking-[0.35em] text-[#7A624C]">
            JINIM
          </p>

          <h1
            id="service-paused-title"
            className="font-serif text-[1.85rem] font-semibold leading-snug tracking-tight text-[#4A3B30] sm:text-[2.05rem]"
          >
            지님
            <br />
            서비스 준비 중입니다.
          </h1>

          <div
            aria-hidden
            className="mx-auto h-px w-12 bg-[#DDD2C4]"
          />

          <p className="text-xs tracking-wide text-[#7A624C]/90">
            jinim.kr
          </p>
        </div>
      </div>
    </div>
  )
}
