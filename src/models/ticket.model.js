import mongoose from 'mongoose'

const ticketSchema = new mongoose.Schema(
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
    },
    total: {
        type: Number,
        required: true,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

export default mongoose.model('Ticket', ticketSchema)