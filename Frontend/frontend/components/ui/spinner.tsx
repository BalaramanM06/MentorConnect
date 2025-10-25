function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-muted"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
      </div>
    </div>

  )
}

export { Spinner }
