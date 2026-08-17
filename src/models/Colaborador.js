import mongoose from 'mongoose';

const ColaboradorSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, 'Por favor, informe o nome do colaborador.'],
      trim: true,
    },
  },
  {
    timestamps: { createdAt: 'criado_em', updatedAt: 'atualizado_em' },
  }
);

export default mongoose.models.Colaborador || mongoose.model('Colaborador', ColaboradorSchema);
