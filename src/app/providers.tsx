import { FC } from "react"
import { Toaster } from "sonner"

interface ProvidersProps {
  children: React.ReactNode
}

const Providers: FC<ProvidersProps> = ({ children }) => {
  return (
    <>
      <Toaster richColors />
      {children}
    </>
  )
}

export default Providers
