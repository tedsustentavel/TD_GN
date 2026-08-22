import mongoose from 'mongoose';

const TipoDeRelacionamentoSchema = new mongoose.Schema(
  {
    tipo_de_relacionamento: {
      type: String,
      required: [true, 'Por favor, informe o tipo de relacionamento.'],
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

export default mongoose.models.TipoDeRelacionamento || mongoose.model('TipoDeRelacionamento', TipoDeRelacionamentoSchema);
