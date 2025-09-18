import Image from 'next/image';

const ProfilePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background-light dark:bg-background-dark overflow-hidden mt-[-80px]">
      <div className="relative w-40 h-40 mb-10">
        <Image
          src="/static/images/mr.r0b0t.jpg"
          alt="Profile Picture"
          layout="fill"
          className="rounded-full object-cover"
        />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
        Hwat Sauce
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 text-center">
        From the shadows, I control.
      </p>
    </div>
  );
};

export default ProfilePage;
