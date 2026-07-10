// components/Cert.tsx
import Image from "next/image";
import { Tilt } from "@/components/tilt";
import { Reveal } from "@/components/reveal";
import { CertZoom } from "@/components/cert-zoom";

const certifications = [
  {
    title: "Certified in Cyber Security",
    imageSrc: "/Certs/CC.png",
    description: "By ISC2",
  },
  {
    title: "INE Certified Cloud Associate",
    imageSrc: "/Certs/ICCA.png",
    description: "By INE",
  },
  {
    title: "ISO/IEC 2700:2022 Information Security Associate",
    imageSrc: "/Certs/SkillFront.png",
    description: "By Skill Front",
  },
    {
    title: "INE Certified Jr. Penetration Tester",
    imageSrc: "/Certs/certificate.png",
    description: "By INE",
  },
    {
    title: "Certified Network Security Practitioner",
    imageSrc: "/Certs/CNSP.png",
    description: "By SecOps Group",
  },
    {
    title: "Certified Red Team Analyst",
    imageSrc: "/Certs/CRTA.png",
    description: "By CyberWarfare Labs",
  },
    {
    title: "Certified Penetration Testing Specialist",
    imageSrc: "/Certs/CPTS.png",
    description: "By HackTheBox",
  },
    {
    title: "Full House - Mini Pro Lab",
    imageSrc: "/Certs/FullHouse.png",
    description: "By HackTheBox",
  },
    {
    title: "P.O.O - Mini Pro Lab",
    imageSrc: "/Certs/P.O.O.png",
    description: "By HackTheBox",
  },
   {
    title: "Dante - Pro Lab",
    imageSrc: "/Certs/Dante.png",
    description: "By HackTheBox",
  },
   {
    title: "Zephyr - Pro Lab",
    imageSrc: "/Certs/Zephyr.png",
    description: "By HackTheBox",
  },
   {
    title: "Solar - Mini Pro Lab",
    imageSrc: "/Certs/Solar.png",
    description: "By HackTheBox",
  },
  {
    title: "Offshore - Pro Lab",
    imageSrc: "/Certs/Offshore.png",
    description: "By HackTheBox",
  },
  {
    title: "Open Access Artical",
    imageSrc: "/Certs/artical1.png",
    description: "MDPI Publication",
  },
  {
    title: "Certified Scanning Strategies and Best Practices Specialist",
    imageSrc: "/Certs/Qualys1.png",
    description: "Qualys",
  },
  {
    title: "Certified Vulnerability Management, Detection, and Response Specialist",
    imageSrc: "/Certs/Qualys2.png",
    description: "Qualys",
  },
];

export default function Cert() {
  return (
    <section className="not-prose my-10">
      <p className="mb-6 font-mono text-xs text-muted-foreground">
        <span className="text-accent">$</span> ls -la ~/certs{" "}
        <span className="text-accent">→</span> {certifications.length} entries
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {certifications.map((cert, index) => (
        <Reveal key={index} delay={Math.min(index % 6, 4) * 70} className="h-full">
        <Tilt max={9} scale={1.03} className="group h-full">
          <article className="relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-muted/40 transition-colors duration-300 hover:border-accent/60">
            {/* Cursor-following glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(240px circle at var(--mx, 50%) var(--my, 50%), rgb(var(--accent) / 0.16), transparent 70%)",
              }}
            />

            {/* Window chrome */}
            <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-accent/80" />
              <span className="ml-2 truncate font-mono text-xs text-muted-foreground">
                {cert.description}
              </span>
            </div>

            {/* Certificate image — larger, never cropped, click to enlarge */}
            <CertZoom src={cert.imageSrc} title={cert.title} description={cert.description}>
              <div className="relative aspect-[3/2] w-full bg-background/60">
                <Image
                  src={cert.imageSrc}
                  alt={cert.title}
                  fill
                  sizes="(min-width: 640px) 340px, 90vw"
                  className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
            </CertZoom>

            <div className="border-t border-border p-4">
              <h2 className="font-mono text-base font-bold leading-snug text-foreground transition-colors group-hover:text-accent">
                {cert.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{cert.description}</p>
            </div>
          </article>
        </Tilt>
        </Reveal>
      ))}
      </div>
    </section>
  );
}
