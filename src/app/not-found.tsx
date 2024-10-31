import Image from "next/image";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center px-6 text-gray-800">
      <Image
        src="/assets/gifs/404.gif"
        width={650}
        height={650}
        alt="Nepal's Flag"
        unoptimized
      />
    </div>
  );
};

export default NotFound;
