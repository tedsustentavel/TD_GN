import mongoose from 'mongoose';

const TermoSchema = new mongoose.Schema(
  {
    termo: {
      type: String,
      required: [true, 'Por favor, informe o termo.'],
      trim: true,
    },
    definicao: {
      type: String,
      required: [true, 'Por favor, informe a definição do termo.'],
      trim: true,
    },
    origem_definicao: {
      type: String,
      trim: true,
    },
    status_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Status',
      required: [true, 'O status é obrigatório.'],
    },
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Colaborador',
      required: [true, 'O dono (owner) é obrigatório.'],
    },
    steward_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Colaborador',
      required: [true, 'O guardião (steward) é obrigatório.'],
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
    termos_relacionados: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Termo',
      },
    ],
    aplicacoes: [
      {
        aplicacao: { type: String, required: true },
        descricao: String,
      },
    ],
    acronimos: [String],
    sinonimos: [String],
    politicas: [
      {
        politica: { type: String, required: true },
        descricao: String,
      },
    ],
    regras_de_calculo: [String],
    exemplos: [String],
    anotacoes: [String],
  },
  {
    timestamps: { createdAt: 'criado_em', updatedAt: 'atualizado_em' },
  }
);

// Adiciona um índice de texto para pesquisa rápida e eficiente de termos
// Previne que seja necessário varrer toda a coleção
if (!mongoose.models.Termo) {
  TermoSchema.index({ 
    termo: 'text', 
    definicao: 'text', 
    acronimos: 'text', 
    sinonimos: 'text' 
  }, {
    weights: {
      termo: 10,
      acronimos: 5,
      sinonimos: 5,
      definicao: 1
    },
    name: "TermoTextIndex"
  });
}

export default mongoose.models.Termo || mongoose.model('Termo', TermoSchema);
