export default function Home() {
  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center px-6 py-24">
      <p className="mb-4 text-sm tracking-wide text-zinc-500">Jinim</p>
      <h1 className="max-w-lg text-center text-2xl font-medium leading-snug text-zinc-900 sm:text-3xl">
        지님 브랜드 웹은 곧 이어서 구현합니다.
      </h1>
      <p className="mt-6 max-w-md text-center text-sm text-zinc-600">
        기획·BI 기준은 저장소의{" "}
        <code className="rounded bg-zinc-200 px-1.5 py-0.5 text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
          docs/
        </code>{" "}
        폴더를 참고하세요.
      </p>
    </main>
  );
}
