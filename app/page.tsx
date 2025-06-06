import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Link href={"/dashboard"}>go to dashboard</Link>
    </div>
  );
}
