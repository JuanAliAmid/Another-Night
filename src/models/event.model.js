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

    price: {
      type: Number,
      required: true,
      min: 0
    },

    capacity: {
      type: Number,
      required: true,
      min: 1
    },

    category: {
      type: String,
      enum: ['Electronica', 'Reggaeton', 'Cumbia', 'Rock'],
      required: true
    },

    location: {
      type: String,
      required: true,
      trim: true
    },

    status: {
      type: String,
      enum: ['draft', 'published', 'cancelled', 'finished'],
      default: 'draft'
    },

    date: {
      type: Date,
      required: true
    },

    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', //para obtener los datos del oreganizer a futuro si es necesario...
      required: true
    }

  },
  {
    timestamps: true,
    versionKey: false,
  }
)

export default mongoose.model('Event', eventsSchema)