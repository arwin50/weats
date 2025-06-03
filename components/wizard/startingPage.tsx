import Image from "next/image";
import Link from "next/link";

export default function StartingPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#fdf1dc] text-center px-4">
      <p className="text-green-700 text-lg mb-2">Hungry?</p>

      <h1 className="text-4xl sm:text-5xl font-semibold text-[#cc4d4d]">
        Where do
      </h1>
      <h1 className="text-4xl sm:text-5xl text-orange-500 font-bold mt-2">
        YOU
      </h1>
      <h1 className="text-4xl sm:text-5xl font-semibold text-[#cc4d4d]">
        wanna eat?
      </h1>

      <Link
        href="/startingWizard"
        className="mt-6 px-6 py-3 bg-[#d3d8a3] text-green-900 rounded-lg shadow-md hover:shadow-lg hover:bg-[#c3d891] transition"
      >
        Let Choosee choose it!
      </Link>

      <div className="mt-10">
        <Image
          src="/choosee-logo.png"
          alt="Choosee Logo"
          width={120}
          height={60}
        />
      </div>
    </div>
  );
}
