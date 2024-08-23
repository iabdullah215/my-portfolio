import Image from 'next/image';

const ProfilePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900">
      <div className="relative w-32 h-32 mb-4">
        <Image
          src="/path/to/your-picture.jpg"
          alt="Profile Picture"
          layout="fill"
          className="rounded-full object-cover"
        />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">!abdu11ah</h1>
      <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
        Your description goes here. You can add any information about yourself or your work
      </p>
    </div>
  );
};

export default ProfilePage;
