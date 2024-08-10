// app/cert/page.tsx
import Cert from "@/components/Cert";

export default function CertPage() {
  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-2 mt-12">My Certifications</h1>
      <p className="text-lg text-gray-600 mb-8">
        Certifications, Publications, and Work
      </p>
      <Cert /> {/* This will render the certifications with images and descriptions */}
    </div>
  );
}
