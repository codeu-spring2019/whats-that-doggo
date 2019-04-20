const automl = require("@google-cloud/automl")
const Busboy = require("busboy")
const client = new automl.PredictionServiceClient()

// Project-level settings.
const projectId = process.env.GCP_PROJECT || "sp19-codeu-35-7727"
const computeRegion = "us-central1"
const modelId = process.env.MODEL_ID || "ICN5266026881461832483"
const scoreThreshold = process.env.SCORE_THRESHOLD || 0.5
const modelFullId = client.modelPath(projectId, computeRegion, modelId)

/**
 * HTTP Cloud Function.
 * This function is exported by index.js, and is executed when
 * you make an HTTP request to the deployed function's endpoint.
 *
 * @param {Object} req Cloud Function request context.
 *                     More info: https://expressjs.com/en/api.html#req
 * @param {Object} res Cloud Function response context.
 *                     More info: https://expressjs.com/en/api.html#res
 */
exports.predict = (req, res, next) => {
  try {
    if (req.method === "OPTIONS") {
      res.set("Access-Control-Allow-Origin", "*")
      res.set(
        "Access-Control-Allow-Headers",
        "Accept, Accept-Language, Content-Language, Content-Type"
      )
      res
        .status(200)
        .send()
        .end()
      return
    }

    if (req.method !== "POST") {
      res
        .status(405)
        .send()
        .end()
      return
    }

    let busboy = new Busboy({
      headers: req.headers,
      limits: {
        fileSize: 1024 * 1024 * 1024 * 10, // 10MB,
        files: 1
      }
    })

    let imageUpload

    // Handle the image upload
    // 1. Validate the MIME type (is it an image?)
    // 2. Check the length (is it too large)
    // 3. Prepare it for prediction
    busboy.on("file", (fieldname, file, filename, enc, mimeType) => {
      console.log(`received file: ${fieldname}=${filename}`)
      file.on("data", function(data) {
        console.log("File [" + fieldname + "] got " + data.length + " bytes")
      })
      file.on("end", function() {
        console.log("File [" + fieldname + "] Finished")
      })

      imageUpload = file
    })

    busboy.on("finish", () => {
      console.log("upload complete")
    })

    req.pipe(busboy)

    // After upload finishes
    let params = {}
    if (scoreThreshold) {
      params.score_threshold = scoreThreshold
    }

    let payload = {
      image: { imageBytes: imageUpload }
    }

    let prediction
    console.log(`using model at: ${modelFullId}`)
    client
      .predict({
        name: modelFullId,
        payload: payload,
        params: params
      })
      .catch(err => {
        throw new Error(err)
      })
      .then(res => {
        prediction = res
      })
      .catch(err => {
        throw new Error(err)
      })

    // Docs: https://cloud.google.com/nodejs/docs/reference/automl/0.1.x/google.cloud.automl.v1beta1#.PredictResponse
    console.log(prediction.payload[0])
    let result = {
      label: prediction.payload[0].displayName,
      score: prediction.payload[0].classification.score
    }

    res.set("Access-Control-Allow-Origin", "*")
    res
      .status(200)
      .json(result)
      .end()
    return
  } catch (err) {
    // Handle errors explicitly
    let errMsg = `fatal: ${JSON.stringify(err)}`
    console.log(errMsg)
    res
      .status(500)
      .json({ error: errMsg })
      .end()
    return
  }
}
