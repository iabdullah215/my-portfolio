// app/cert/page.tsx
import Cert from "@/components/Cert";

export default function CertPage() {
  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-8 mt-12">My Certifications</h1>
      <Cert /> {/* This will render the certifications with images and descriptions */}
    </div>
  );
}
