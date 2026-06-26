import Image from 'next/image';

const ProfilePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background overflow-hidden mt-[-80px]">
      <div className="relative w-40 h-40 mb-10 rounded-full ring-2 ring-accent/60 ring-offset-4 ring-offset-background">
        <Image
          src="/static/images/mr.r0b0t.jpg"
          alt="Profile Picture"
          layout="fill"
          className="rounded-full object-cover"
        />
      </div>
      <h1 className="font-mono text-3xl font-bold tracking-tight text-foreground mb-2">
        Hwat<span className="text-accent">.</span>Sauce
      </h1>
      <p className="font-mono text-sm text-muted-foreground text-center">
        <span className="text-accent">&gt;</span> From the shadows, I control.
      </p>
    </div>
  );
};

export default ProfilePage;
