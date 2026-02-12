import { Zap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/20 py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary/50" />
          <span className="font-display text-xs font-medium tracking-wide">
            TECH<span className="text-gradient">SPARK</span>
          </span>
        </div>
        <p className="text-2xs text-muted-foreground/60">
          © {new Date().getFullYear()} TechSpark Technologies. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
