export default function Footer() {
  return (
    <footer className="py-8 px-6" style={{ borderTop: '1px solid var(--border-card)' }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm" style={{ color: 'var(--text-dimmed)' }}>
          © {new Date().getFullYear()}{" "}
          <span className="gradient-text font-medium">Sughanthan A K</span>.
          All rights reserved.
        </p>
        <p className="text-xs font-mono" style={{ color: 'var(--text-dimmed)' }}>
          Built with Next.js, TypeScript & Tailwind CSS
        </p>
      </div>
    </footer>
  );
}
