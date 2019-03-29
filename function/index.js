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
exports.predictImage = (req, res) => {

  try {
  // TODO:
  // 1. Take image from request (req) and POST to Auto ML predict API
  // 2. Handle errors - e.g. the image couldn't be predicted? No label returned?
  // 3. Return the Auto ML label / score back in the response via res.send
  
  // https://cloud.google.com/nodejs/docs/reference/automl/0.1.x/v1beta1.PredictionServiceClient#predict
  const formattedName = client.modelPath('[PROJECT]', '[LOCATION]', '[MODEL]');
  const payload = {};
  const request = {
    name: formattedName,
    payload: payload,
  };
  
  let prediction = await client.predict(request)
  
  // TODO: unpack https://cloud.google.com/nodejs/docs/reference/automl/0.1.x/google.cloud.automl.v1beta1#.PredictResponse
  let result = {
    label: prediction.label,
    score: prediction.score,
  }
  
  res.status(200).json(result);
  
  } catch (e) {
    // Handle errors explicitly
    res.status(500).json({"error": err)
  }
};
