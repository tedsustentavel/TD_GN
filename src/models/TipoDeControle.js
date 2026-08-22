import mongoose from 'mongoose';

const TipoDeControleSchema = new mongoose.Schema(
  {
    tipo_de_controle: {
      type: String,
      required: [true, 'Por favor, informe o tipo de controle.'],
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

export default mongoose.models.TipoDeControle || mongoose.model('TipoDeControle', TipoDeControleSchema);
