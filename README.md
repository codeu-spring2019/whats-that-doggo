# whats-that-doggo

> http://www.whatsthatdoggo.com/

What kind of dog is THAT?! 🐕

- This is the code for a dog-breed-prediction service that uses a model trained with Google Cloud's [AutoML Vision](https://cloud.google.com/automl/) service to predict the breed of dog from an image.
- It uses the [Stanford Dogs Dataset](http://vision.stanford.edu/aditya86/ImageNetDogs/), which has 120 breeds of dog across a 20k image dataset.
- The model was trained for just over 24 hours, with an average precision of 0.918 (AUC). Inference is typically performed within a second on a full-sized model.

This was a project by a group of students as part of Google's CodeU program - a program to help college students work on a series of small software projects alongside a Googler in a collborative environment.

## Credits:

> Grace Cheng, Jose Jorge Jiminez-Olivas, Michela Burns, Rabab Ibrahim
> Advised by PA Matt Silverlock

## Testing it

You can test the model locally by using `curl` on the command-line and passing an image as a form upload:

```sh
➜  curl -XPOST "https://us-central1-sp19-codeu-35-7727.cloudfunctions.net/predict" -F file=@malamute.jpg
{"label":"malamute","score":0.8795406818389893}%
```

If the model doesn't recognize the breed, you'll see the below:

```sh
➜  curl -XPOST "https://us-central1-sp19-codeu-35-7727.cloudfunctions.net/predict" -F file=@carbon.png
{"error":"Error: Unable to make a prediction for that image: it might be a breed we don't recognize yet!"}%
```

## Known Breeds

The 120 breeds (classes) are below:

## Technology

The project has three major components:

- The AutoML Vision model for inference
- A Cloud Function as the proxy between clients and the (authenticated) backend. The proxy also validates the image upload & prepares it for the AutoML API
- A static front-end website, served out of a Google Cloud Storage bucket.

### Possible Future Work

Getting the project done within the time bounds of the program was important, but beyond that, the team considered stretch goals of:

- Exporting the model from AutoML as a standalone TensorFlow model
- Serving the model directly from the front-end (client-side-only) and thus removing the need for a Cloud Function proxy
- Re-training the model with a larger dataset

## License

Apache 2.0 licensed. See the LICENSE file for details.
