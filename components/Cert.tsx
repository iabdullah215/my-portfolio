// components/Cert.tsx
import Image from "next/image";

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
];

export default function Cert() {
  return (
    <section className="my-10">
      {certifications.map((cert, index) => (
        <div key={index} className="flex flex-col md:flex-row mb-8 items-center">
          <div className="md:w-1/2 p-4">
            <Image src={cert.imageSrc} alt={cert.title} width={300} height={200} className="rounded-lg" />
          </div>
          <div className="md:w-1/2 p-4">
            <h3 className="text-xl font-bold mb-2">{cert.title}</h3>
            <p>{cert.description}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
