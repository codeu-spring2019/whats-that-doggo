const automl = require('@google-cloud/automl');
const client = new automl.PredictionServiceClient();


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

@@ -19,14 +19,29 @@ exports.predictImage = (req, res) => {
    if (req.method === "OPTIONS") {
          res.set("Access-Control-Allow-Origin", "*")
          res.set("Access-Control-Allow-Headers", "Accept, Accept-Language, Content-Language, Content-Type")
          res.status(200).send()
        }

      	if (req.method !== "POST") {
          res.status(405).send()
        }
}

  try {
  // TODO:
  // 1. Take image from request (req) and POST to Auto ML predict API
  // 2. Handle errors - e.g. the image couldn't be predicted? No label returned?
  // 3. Return the Auto ML label / score back in the response via res.send
  const projectId = "sp19-codeu-35-7727";
  const computeRegion = "us_central1";
  const modelId = “ICN12345”;
  const filePath = "gs://sp19-codeu-35-7727-vcm/dog_dataset_two/";
  const scoreThreshold = 0.5;

  // https://cloud.google.com/nodejs/docs/reference/automl/0.1.x/v1beta1.PredictionServiceClient#predict
  const formattedName = client.modelPath('sp19-codeu-35-7727', 'gs://sp19-codeu-35-7727-vcm/dog_dataset_two', 'dog_dataset_two');
  const payload = {};

  //const params = {};
  //if (scoreThreshold) {
    //params.score_threshold = scoreThreshold;
  //}

  payload.image = {imageBytes: content};
  const request = {
    name: formattedName,
    payload: payload,
    //params: params,
  };


  
  let prediction = await client.predict(request)
  
  // TODO: unpack https://cloud.google.com/nodejs/docs/reference/automl/0.1.x/google.cloud.automl.v1beta1#.PredictResponse
  let result = {
    label: prediction.label,
    score: prediction.score,
  }
  
  res.set("Access-Control-Allow-Origin", "*")
  res.status(200).json(result);
  
  } catch (e) {
    // Handle errors explicitly
    res.status(500).json({"error": err)
  }
};
