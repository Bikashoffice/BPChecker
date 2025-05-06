
import { ThermometerIcon } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <ThermometerIcon className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-theme-purple-dark bg-clip-text text-transparent">
            Pulse Pathway Pal
          </h1>
        </div>
        <div className="text-sm text-muted-foreground">
          Your health companion
        </div>
      </div>
    </header>
  );
}
