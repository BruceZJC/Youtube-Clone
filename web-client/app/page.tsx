import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";
import { getVideos } from "./utility/firebase/functions";
import { Suspense } from "react";

export default async function Home() {
  const videos = await getVideos();

  return (
    <main>
      {
        videos.map((video) => (
          <Link href={`/watch?v=${video.filename}`} key={`${video.id}`}>
            <Image src={'/thumbnail.png'} alt='video' width={120} height={100}
              className={styles.thumbnail}/>
          </Link>
        ))
      }
    </main>
  )
}

export const revalidate = 15;

