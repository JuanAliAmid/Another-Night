import mongoose from 'mongoose'

const eventsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true, 
      default: "",
    },

    starts_at: {
      type: Date,
      required: true,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

export default mongoose.model('Event', eventsSchema)