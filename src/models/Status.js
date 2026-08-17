import mongoose from 'mongoose';

const StatusSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: [true, 'Por favor, informe o nome do status.'],
      unique: true,
      trim: true,
    },
    descricao: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: 'criado_em', updatedAt: 'atualizado_em' },
  }
);

export default mongoose.models.Status || mongoose.model('Status', StatusSchema);
