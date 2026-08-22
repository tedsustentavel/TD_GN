import mongoose from 'mongoose';

const AtributoSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, 'Por favor, informe o nome do atributo.'],
      trim: true,
    },
    descricao: {
      type: String,
      trim: true,
    },
    tamanho: {
      type: Number,
      default: null,
    },
    chave_primaria: {
      type: Boolean,
      default: false,
    },
    chave_estrangeira: {
      type: Boolean,
      default: false,
    },
    anulavel: {
      type: Boolean,
      default: true,
    },
    tipo_de_atributo_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TipoDeAtributo',
      required: [true, 'O tipo de atributo é obrigatório.'],
    },
    tipo_de_controle_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TipoDeControle',
      required: [true, 'O tipo de controle é obrigatório.'],
    },
  },
  {
    timestamps: { createdAt: 'criado_em', updatedAt: 'atualizado_em' },
  }
);

const TabelaSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, 'Por favor, informe o nome da tabela.'],
      trim: true,
    },
    descricao: {
      type: String,
      trim: true,
    },
    tipo_de_tabela_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TipoDeTabela',
      required: [true, 'O tipo de tabela é obrigatório.'],
    },
    source_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Source',
      required: [true, 'O data source é obrigatório.'],
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
    dba_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Colaborador',
      required: [true, 'O DBA é obrigatório.'],
    },
    atributos: [AtributoSchema],
  },
  {
    timestamps: { createdAt: 'criado_em', updatedAt: 'atualizado_em' },
  }
);

if (!mongoose.models.Tabela) {
  TabelaSchema.index({ nome: 'text', descricao: 'text' });
}

export default mongoose.models.Tabela || mongoose.model('Tabela', TabelaSchema);
