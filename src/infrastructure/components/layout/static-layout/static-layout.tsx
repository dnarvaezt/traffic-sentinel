import { ThemeToggle } from "../../theme"
import "./static-layout.scss"

export const StaticLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="static-layout">
      {children}
      <div className="static-layout__theme-toggle">
        <ThemeToggle />
      </div>
    </div>
  )
}
