import mongoose from 'mongoose';

const RelacionamentoSchema = new mongoose.Schema(
  {
    tipo_de_relacionamento_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TipoDeRelacionamento',
      required: [true, 'O tipo de relacionamento é obrigatório.'],
    },
    tabela_origem_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tabela',
      required: [true, 'A tabela de origem é obrigatória.'],
    },
    atributo_origem_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'O atributo de origem é obrigatório.'],
    },
    tabela_destino_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tabela',
      required: [true, 'A tabela de destino é obrigatória.'],
    },
    atributo_destino_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'O atributo de destino é obrigatório.'],
    },
  },
  {
    timestamps: { createdAt: 'criado_em', updatedAt: 'atualizado_em' },
  }
);

export default mongoose.models.Relacionamento || mongoose.model('Relacionamento', RelacionamentoSchema);
