import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Link href={"/startingWizard"}> go to starting spage</Link>
      <Link href={"/dashboard"}>go to dashboard</Link>
    </div>
  );
}
