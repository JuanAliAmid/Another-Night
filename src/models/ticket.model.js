import mongoose from 'mongoose'

const ticketSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },

    status: {
      type: String,
      enum: ['active', 'expired'],
      default: 'active',
    },

    expires_at: {
      type: Date,
      required: true,
    },

    amount: {
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