import Image from "next/image";
import { BinaryRain } from "@/components/binary-rain";
import { Tilt } from "@/components/tilt";

const ProfilePage = () => {
  return (
    <section className="not-prose relative flex min-h-[72vh] flex-col items-center justify-center overflow-hidden rounded-2xl border border-border">
      {/* Binary rain backdrop */}
      <BinaryRain className="pointer-events-none absolute inset-0 z-0 opacity-70" />

      {/* Fade so content reads clearly over the rain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgb(var(--background)/0.75)_70%)]"
      />

      <div className="relative z-10 flex flex-col items-center px-4 text-center">
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
