import { credential } from "firebase-admin";
import {initializeApp} from "firebase-admin/app";
import {Firestore} from "firebase-admin/firestore";


// pass in credential to get the access to the firestore
initializeApp({credential: credential.applicationDefault()});

const firestore = new Firestore();

// Note: This requires setting an env variable in Cloud Run
/** if (process.env.NODE_ENV !== 'production') {
  firestore.settings({
      host: "localhost:8080", // Default port for Firestore emulator
      ssl: false
  });
} */

// Set a collection ID used in FireStore
const videoCollectionId = 'videos';

export interface Video {
  id?: string,
  uid?: string,
  filename?: string,
  // Limited options of status!! 
  status?: 'processing' | 'processed',
  title?: string,
  description?: string
}

/**
 * Given a video id, we want to fetch that video from Firestore
 * @param videoId 
 * @returns 
 */
async function getVideo(videoId: string) {
  const snapshot = await firestore.collection(videoCollectionId).doc(videoId).get();

  // First try to cast the data into the Video interface defined above, if the returned Data is Undefined, we simply return a empty obj
  return (snapshot.data() as Video) ?? {};
}


/**
 * Set 
 * @param videoId 
 * @param video the Video object defined above 
 * @returns 
 */
export function setVideo(videoId: string, video: Video) {
  return firestore
    .collection(videoCollectionId)
    .doc(videoId)
    .set(video, { merge: true }) // If there a video with the same id aleady exist, we merge the the information, not overwrtie
}


/**
 * Determine if a video is new or not
 * @param videoId 
 * @returns 
 */
export async function isVideoNew(videoId: string){
  const video = await getVideo(videoId);
  return video?.status === undefined;
}