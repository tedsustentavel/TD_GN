import mongoose from 'mongoose';

const TipoDeAtributoSchema = new mongoose.Schema(
  {
    tipo_de_atributo: {
      type: String,
      required: [true, 'Por favor, informe o tipo de atributo.'],
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

export default mongoose.models.TipoDeAtributo || mongoose.model('TipoDeAtributo', TipoDeAtributoSchema);
