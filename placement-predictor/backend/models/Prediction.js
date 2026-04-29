import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    inputData: {
      type: Object,
      required: true,
    },

    prediction: {
      type: String,
      required: true,
    },

    confidence: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite error (important in dev with nodemon)
const Prediction =
  mongoose.models.Prediction ||
  mongoose.model("Prediction", predictionSchema);

export default Prediction;