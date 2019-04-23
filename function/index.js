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
    // Only accept one file upload
    limits: {
      fileSize: 1024 * 1024 * 1024 * 10, // 10MB,
      files: 1
    }
  })

  // Handle the image upload
  let imageUpload = []
  busboy.on("file", (fieldname, file, filename, enc, mimeType) => {
    console.log(
      `received file: ${fieldname}=${filename} - encoding=${enc} - mimetype=${mimeType}`
    )
    // Validate the MIME type (must be an image - e.g. image/png, image/jpg, etc)
    if (!mimeType.includes("image")) {
      res
        .status(400)
        .json({ error: `upload must be an image: got ${mimeType}` })
        .end()
      return
    }

    file.on("data", function(data) {
      console.log(`file upload '${fieldname}' - length: ${data.length}`)
      // We have to append each "chunk" received from the client, and stitch
      // together after.
      imageUpload.push(data)
    })
  })

  busboy.on("finish", () => {
    // Concatenate all chunks into a single Buffer type (a byte array).
    // Since images sent to the AutoML API must be also base64-encoded, we transform
    // the Buffer to a base64-encoded string.
    let image = Buffer.concat(imageUpload).toString("base64")
    predictImage(req, res, image)
  })

  busboy.end(req.rawBody)
}

/*
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 * @param {string} image Image data as a base64-encoded string.
 */
function predictImage(req, res, image) {
  console.log("predicting image")
  try {
    // Build our API request - a params object that defines the cut-off
    // confidence level, and a payload object that contains base64-encoded image
    // bytes.
    let params = {}
    if (scoreThreshold) {
      params.score_threshold = scoreThreshold
    }

    let payload = {
      image: { imageBytes: image }
    }

    console.log(`using model at: ${modelFullId}`)
    client
      .predict({
        name: modelFullId,
        payload: payload,
        params: params
      })
      .then(prediction => {
        console.log("prediction response returned")
        // Docs: https://cloud.google.com/nodejs/docs/reference/automl/0.1.x/google.cloud.automl.v1beta1#.PredictResponse
        // Get only the first prediction response
        let data = prediction[0]["payload"]

        if (!data[0]) {
          throw new Error(
            "Unable to make a prediction for that image: it might be a breed we don't recognize yet!"
          )
        }

        // Build our response object
        let result = {
          label: data[0].displayName,
          score: data[0].classification.score
        }

        res.set("Access-Control-Allow-Origin", "*")
        res
          .status(200)
          .json(result)
          .end()
        return
      })
      .catch(err => {
        console.log(err)
        res
          .status(500)
          .json({ error: err.toString() })
          .end()
        return
      })
  } catch (err) {
    // Handle errors explicitly
    console.log(err)
    res
      .status(500)
      .json({ error: err.toString() })
      .end()
    return
  }
}
