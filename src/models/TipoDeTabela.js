import mongoose from 'mongoose';

const TipoDeTabelaSchema = new mongoose.Schema(
  {
    tipo_de_tabela: {
      type: String,
      required: [true, 'Por favor, informe o tipo de tabela.'],
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

export default mongoose.models.TipoDeTabela || mongoose.model('TipoDeTabela', TipoDeTabelaSchema);
