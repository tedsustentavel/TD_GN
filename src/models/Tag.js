import mongoose from 'mongoose';

const TagSchema = new mongoose.Schema(
  {
    tag: {
      type: String,
      required: [true, 'Por favor, informe o nome da tag.'],
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: 'criado_em', updatedAt: 'atualizado_em' },
  }
);

export default mongoose.models.Tag || mongoose.model('Tag', TagSchema);
