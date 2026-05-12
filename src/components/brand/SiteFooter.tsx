export function SiteFooter() {
  return (
    <footer className="border-t border-jinim-subtle/70 bg-jinim-ivory py-10 text-center">
      <p className="text-xs text-jinim-text/70">
        © {new Date().getFullYear()} 지님 Jinim
      </p>
    </footer>
  );
}
