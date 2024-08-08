// app/cert/page.tsx
import Cert from "@/components/Cert";

export default function CertPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">My Certifications</h1>
      <Cert /> {/* This will render the certifications with images and descriptions */}
    </div>
  );
}
