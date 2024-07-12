import express from 'express';
import { convertVideo, deleteProcessedVideo, deleteRawVideo, downloadRawVideo, setupDirectories, uploadProcessedVideo } from './storage';
import { isVideoNew, setVideo } from './firestore';


setupDirectories();

const app = express();
app.use(express.json());

app.post('/process-video', async (req, res) => {
    // Get the bucket and filename from the Cloud pub/sub message
    let data;
    try{
        const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
        data = JSON.parse(message);
        if (!data.name){
            throw new Error("Invalid message payload received.");
        }
    } catch (error){
        console.log(error);
        return res.status(400).send("Bad Request: Missing File Name.");
    }

    const inputFileName = data.name;
    const videoId = inputFileName.split(".")[0]

    const outputFileName = `processed-${data.name}`;

    if (!isVideoNew(videoId)){
        return res.status(400).send("Bad Request: video already in process or processed.")
    } else {
        await setVideo(videoId, {
            id: videoId,
            uid: videoId.split("-")[0],
            status: 'processing',
        });
    }


    // Downloading the raw video from the cloud storage
    await downloadRawVideo(inputFileName);
    
    // Convert the video to 360p, Use try catch because we know that conversion might fail
    try{
        await convertVideo(inputFileName, outputFileName);
    } catch (error){
        await Promise.all([
            deleteRawVideo(inputFileName),
            deleteProcessedVideo(outputFileName)
        ]);
        
        console.log(error);
        return res.status(500).send("Internal Server Error: Video Processing Failed.");
    }

    //Upload the processed video to Cloud Storage
    await uploadProcessedVideo(outputFileName);

    setVideo(videoId, {
        status: 'processed',
        filename: outputFileName,
    });
    await Promise.all([
        deleteRawVideo(inputFileName),
        deleteProcessedVideo(outputFileName)
    ]);

    return res.status(200).send("Processing Finished Successfully!");

});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

