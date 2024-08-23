import Image from 'next/image';

const ProfilePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 pt-10 pb-8">
      <div className="relative w-40 h-40 mb-6"> 
        <Image
          src="/static/images/mr.r0b0t.jpg"
          alt="Profile Picture"
          layout="fill"
          className="rounded-full object-cover"
        />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        !abdu11ah
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        From the shadows, I control.
      </p>
    </div>
  );
};

export default ProfilePage;
