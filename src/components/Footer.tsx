import { Zap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          <span className="font-display text-sm font-bold">
            TECH<span className="text-gradient">SPARK</span>
          </span>
          <span className="text-muted-foreground text-sm ml-2">
            Technologies
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} TechSpark Technologies. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
