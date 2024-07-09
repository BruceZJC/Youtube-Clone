// 1. Google Cloud Storage interactions
// 2. Local file interactions

import { Storage } from "@google-cloud/storage";

//Import filesystem from node js filesystem
import fs from 'fs';
import ffmpeg from "fluent-ffmpeg";
import { rejects } from "assert";

// Creating an instance of Google Cloud Storage
const storage = new Storage();

const rawVideoBucketName = "bruce-yt-raw-videos";
const processedVideoBucketName = "bruce-yt-processed-videos";

const localRawVideoPath = "./raw-videos";
const localProcessedVideoPath = "./processed-videos";

/**
 * Creates the local directories for raw and processed video.
 */
export function setupDirectories(){
    ensureDirectoryExistence(localRawVideoPath);
    ensureDirectoryExistence(localProcessedVideoPath);

}

/**
 * @param rawVideoName - The name of the file to convert from {@link localRawVideoPath}.
 * @param processedVideoName - The name of the file to conver to {@link localProcessedVideoPath}.
 * @returns A promise that resolves when the video has been converted
 */
export function convertVideo(rawVideoName: string, processedVideoName: string){
    return new Promise <void>((resolve, reject) => {
        // Create the ffmpeg command
        ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
        .outputOptions('-vf', 'scale=-1:360') // 360p
        .on('end', function() {
            console.log('Processing finished successfully');
            resolve();
        })
        .on('error', function(err: any) {
            console.log('An error occurred: ' + err.message);
            reject(err);
        })
        .save(`${localProcessedVideoPath}/${processedVideoName}`);
    });

}

/**
 * @param fileName - The name of the file to download from the 
 * {@link rawVideoBucketName} bucket into the {@link localRawVideoPath} folder.
 * @returns A promise that resolves when the file has been downloaded.
 * ASYNC functions have to return a promise!!!!!!!!!!!
 */
export async function downloadRawVideo(fileName: string) {

    // await let the following code wait for the current block to finish
    await storage.bucket(rawVideoBucketName)
        .file(fileName)
        .download({destination: `${localRawVideoPath}/${fileName}`});

    console.log(
        `gs://${rawVideoBucketName}/${fileName} downloaded to ${localRawVideoPath}/${fileName}.`
    );
}


/**
 * @param fileName - The name of the file to upload from the 
 * {@link localProcessedVideoPath} folder into the {@link processedVideoBucketName}.
 * @returns A promise that resolves when the file has been uploaded.
 */
export async function uploadProcessedVideo(fileName: string) {
    const bucket = storage.bucket(processedVideoBucketName);

    await bucket.upload(`${localProcessedVideoPath}/${fileName}`,{
        destination: fileName
    });
    console.log(`${localRawVideoPath}/${fileName} uploaded to gs:// ${processedVideoBucketName}/${fileName}.`);

    await bucket.file(fileName).makePublic();
}

/**
 * @param fileName - The name of the file to delete from the
 * {@link localRawVideoPath} folder.
 * @returns A promise that resolves when the file has been deleted.
 * 
 */
export function deleteRawVideo(fileName: string) {
    return deleteFile(`${localRawVideoPath}/${fileName}`);
  }
  
  
  /**
  * @param fileName - The name of the file to delete from the
  * {@link localProcessedVideoPath} folder.
  * @returns A promise that resolves when the file has been deleted.
  * 
  */
  export function deleteProcessedVideo(fileName: string) {
    return deleteFile(`${localProcessedVideoPath}/${fileName}`);
  }


/**
 * @param filePath - The path of the file to delete.
 * @returns A promise that resolves when the file has been deleted.
 */
function deleteFile(filePath: string): Promise<void>{
    return new Promise((resolve, reject) => {
        // Check if file actually exist
        if(fs.existsSync(filePath)){
            fs.unlink(filePath, (err) => {
                if(err){
                    console.log(`Failed to delete filea at ${filePath}, Error message: `, JSON.stringify(err));
                    reject(err);
                } else {
                    return resolve();
                }
            })
        } else {
            console.log(`File not found at ${filePath}, skipping the delete.`);
            reject(`File path ${filePath} does not exist.`);
        }
    });
}

/**
 * Ensures a local directory exists, creating it if necessary.
 * @param {string} dirPath - The directory path to check.
 */
function ensureDirectoryExistence(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true }); // recursive: true enables creating nested directories
      console.log(`Directory created at ${dirPath}`);
    }
  }