interface LoginHeaderProps {
  title: string
  subtitle: string
}

export function LoginHeader({ title, subtitle }: LoginHeaderProps) {
  return (
    <div className="text-center mb-6">
    <h2 className="text-2xl font-extrabold mt-4 text-amber-800 dark:text-amber-100 tracking-wide drop-shadow-sm">
        {title}
    </h2>
    <p className="text-amber-600 dark:text-stone-400 text-sm font-medium">
        {subtitle}
    </p>
</div>
  )
}
