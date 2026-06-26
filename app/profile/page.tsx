import Image from "next/image";
import { Tilt } from "@/components/tilt";

const ProfilePage = () => {
  return (
    <section className="not-prose flex min-h-[72vh] flex-col items-center justify-center px-4 text-center">
        <Tilt className="mb-8" max={16} scale={1.06}>
          <div className="relative h-44 w-44 overflow-hidden rounded-full ring-2 ring-accent/70 ring-offset-4 ring-offset-background shadow-[0_0_45px_-5px_rgb(var(--accent)/0.55)]">
            <Image
              src="/static/images/mr.r0b0t.jpg"
              alt="Hwat Sauce"
              fill
              sizes="176px"
              priority
              className="object-cover"
            />
          </div>
        </Tilt>

        <div className="relative">
          {/* Soft scrim so text stays legible over the rain */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-10 -inset-y-6 -z-10 bg-[radial-gradient(ellipse_at_center,rgb(var(--background)/0.85),transparent_75%)]"
          />
          <h1 className="font-mono text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Hwat<span className="text-accent">.</span>Sauce
          </h1>
          <p className="mt-3 font-mono text-sm text-muted-foreground">
            <span className="text-accent">&gt;</span> From the shadows, I control.
            <span className="ml-0.5 inline-block w-2 animate-pulse text-accent">_</span>
          </p>
        </div>
    </section>
  );
};

export default ProfilePage;
