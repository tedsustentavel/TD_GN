import dbConnect from '@/lib/db';
import Colaborador from '@/models/Colaborador';
import Status from '@/models/Status';
import Tag from '@/models/Tag';
import Termo from '@/models/Termo';
import Source from '@/models/Source';
import TipoDeTabela from '@/models/TipoDeTabela';
import TipoDeAtributo from '@/models/TipoDeAtributo';
import TipoDeControle from '@/models/TipoDeControle';
import TipoDeRelacionamento from '@/models/TipoDeRelacionamento';
import Tabela from '@/models/Tabela';
import Relacionamento from '@/models/Relacionamento';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();

    // Limpar o banco de dados antes de popular (Glossário)
    await Termo.deleteMany({});
    await Colaborador.deleteMany({});
    await Status.deleteMany({});
    await Tag.deleteMany({});

    // Limpar o banco de dados antes de popular (Dicionário de Dados)
    await Source.deleteMany({});
    await TipoDeTabela.deleteMany({});
    await TipoDeAtributo.deleteMany({});
    await TipoDeControle.deleteMany({});
    await TipoDeRelacionamento.deleteMany({});
    await Tabela.deleteMany({});
    await Relacionamento.deleteMany({});

    // ─── GLOSSÁRIO DE NEGÓCIOS ───

    // 1. Criar Status
    const statusRascunho = await Status.create({ 
      status: 'Rascunho', 
      descricao: 'Termo em fase de definição inicial e rascunho de conteúdo' 
    });
    const statusRevisao = await Status.create({ 
      status: 'Em Revisão', 
      descricao: 'Termo sendo avaliado pelo Steward de Dados e equipe de governança' 
    });
    const statusAprovado = await Status.create({ 
      status: 'Aprovado', 
      descricao: 'Termo aprovado e ativo para uso institucional' 
    });
    const statusObsoleto = await Status.create({ 
      status: 'Obsoleto', 
      descricao: 'Termo descontinuado que foi substituído por outro termo de negócio' 
    });

    // 2. Criar Colaboradores
    const marcus = await Colaborador.create({ nome: 'Marcus Bispo' });
    const maria = await Colaborador.create({ nome: 'Maria Silva' });
    const joao = await Colaborador.create({ nome: 'João Souza' });

    // 3. Criar Tags
    const tagFinanceiro = await Tag.create({ tag: 'Financeiro' });
    const tagVendas = await Tag.create({ tag: 'Vendas' });
    const tagLGPD = await Tag.create({ tag: 'LGPD' });
    const tagMarketing = await Tag.create({ tag: 'Marketing' });

    // 4. Criar Termos
    const termoChurn = await Termo.create({
      termo: 'Churn Rate',
      definicao: 'Taxa de cancelamento de clientes em um determinado período de tempo, calculada dividindo os cancelamentos pelo número inicial de clientes.',
      origem_definicao: 'Dicionário de Métricas SaaS',
      status_id: statusAprovado._id,
      owner_id: marcus._id,
      steward_id: maria._id,
      tags: [tagFinanceiro._id, tagVendas._id],
      acronimos: ['CR', 'TCC'],
      sinonimos: ['Taxa de Evasão de Clientes', 'Cancelamento de Assinaturas'],
      aplicacoes: [
        { aplicacao: 'CRM Vendas', descricao: 'Mapeamento visualizado no painel de pós-venda.' },
        { aplicacao: 'Dashboard Financeiro', descricao: 'Calcula o impacto financeiro no faturamento recorrente.' }
      ],
      politicas: [
        { politica: 'Política de Retenção de Clientes', descricao: 'Lógica interna que visa manter o Churn abaixo de 3% ao mês.' }
      ],
      regras_de_calculo: [
        'Churn Rate = (Clientes cancelados no período / Clientes ativos no início do período) * 100'
      ],
      exemplos: [
        'Se começamos o mês com 100 clientes e 5 cancelaram, o Churn Rate foi de 5%.'
      ],
      anotacoes: [
        'Deve ser monitorado mensalmente e revisado pelo time de Customer Success.'
      ]
    });

    const termoCAC = await Termo.create({
      termo: 'Custo de Aquisição de Cliente',
      definicao: 'Investimento médio em esforços diretos para conquistar um novo cliente, somando marketing e vendas em um período de tempo.',
      origem_definicao: 'Guia de Métricas de Growth',
      status_id: statusAprovado._id,
      owner_id: joao._id,
      steward_id: maria._id,
      tags: [tagFinanceiro._id, tagMarketing._id],
      acronimos: ['CAC'],
      sinonimos: ['Custo por Cliente Novo'],
      termos_relacionados: [termoChurn._id],
      aplicacoes: [
        { aplicacao: 'Mídia Paga (Google Ads)', descricao: 'Usado para calcular ROI de campanhas de anúncios.' }
      ],
      politicas: [
        { politica: 'Orçamento de Marketing', descricao: 'O CAC não deve exceder R$ 150,00 por cliente.' }
      ],
      regras_de_calculo: [
        'CAC = (Custos de Vendas + Custos de Marketing) / Novos Clientes Conquistados'
      ],
      exemplos: [
        'Se investimos R$ 10.000,00 e obtivemos 100 clientes, o CAC foi de R$ 100,00.'
      ]
    });

    const termoLTV = await Termo.create({
      termo: 'Lifetime Value',
      definicao: 'O valor financeiro total estimado que um cliente gera para o negócio ao longo de todo o seu relacionamento com a empresa.',
      origem_definicao: 'Métricas de Negócio SaaS',
      status_id: statusRevisao._id,
      owner_id: marcus._id,
      steward_id: joao._id,
      tags: [tagFinanceiro._id],
      acronimos: ['LTV', 'CLV'],
      sinonimos: ['Valor do Tempo de Vida do Cliente'],
      termos_relacionados: [termoChurn._id, termoCAC._id],
      aplicacoes: [
        { aplicacao: 'Planejamento Estratégico', descricao: 'Define viabilidade de aquisição de novos canais de vendas.' }
      ],
      regras_de_calculo: [
        'LTV = Receita Média por Cliente (ARPU) * Tempo Médio de Retenção'
      ],
      exemplos: [
        'Se o cliente gasta R$ 100,00/mês e fica 12 meses, o LTV é R$ 1.200,00.'
      ],
      anotacoes: [
        'Em revisão técnica para incluir margem bruta no cálculo oficial.'
      ]
    });

    // ─── DICIONÁRIO DE DADOS ───

    // 1. Criar Fontes de Dados (Sources)
    const sourcePg = await Source.create({
      nome: 'PostgreSQL Produção',
      descricao: 'Banco relacional transacional da aplicação principal'
    });
    const sourceDw = await Source.create({
      nome: 'Snowflake Data Warehouse',
      descricao: 'Repositório de dados analíticos para dashboards'
    });

    // 2. Criar Tipos de Tabela
    const tipoTabelaTransac = await TipoDeTabela.create({
      tipo_de_tabela: 'Transacional',
      descricao: 'Tabela OLTP para persistência de transações correntes'
    });
    const tipoTabelaDim = await TipoDeTabela.create({
      tipo_de_tabela: 'Dimensão',
      descricao: 'Tabela dimensional (Star Schema/Snowflake) contendo descritores'
    });
    const tipoTabelaFato = await TipoDeTabela.create({
      tipo_de_tabela: 'Fato',
      descricao: 'Tabela fato analítica contendo métricas e chaves'
    });

    // 3. Criar Tipos de Atributo (Data Types)
    const tipoAttrVarchar = await TipoDeAtributo.create({
      tipo_de_atributo: 'VARCHAR',
      descricao: 'Texto de tamanho variável'
    });
    const tipoAttrInt = await TipoDeAtributo.create({
      tipo_de_atributo: 'INTEGER',
      descricao: 'Número inteiro de 4 bytes'
    });
    const tipoAttrNumeric = await TipoDeAtributo.create({
      tipo_de_atributo: 'NUMERIC',
      descricao: 'Número decimal preciso'
    });
    const tipoAttrDatetime = await TipoDeAtributo.create({
      tipo_de_atributo: 'DATETIME',
      descricao: 'Data e hora completa'
    });

    // 4. Criar Tipos de Controle
    const ctrlNormal = await TipoDeControle.create({
      tipo_de_controle: 'Normal / Público',
      descricao: 'Dado aberto sem classificação ou regras especiais'
    });
    const ctrlPessoal = await TipoDeControle.create({
      tipo_de_controle: 'LGPD - Pessoal',
      descricao: 'Dado pessoal sujeito à legislação de privacidade'
    });
    const ctrlSensivel = await TipoDeControle.create({
      tipo_de_controle: 'LGPD - Sensível',
      descricao: 'Dado sensível que requer anonimização ou criptografia'
    });

    // 5. Criar Tipos de Relacionamento
    const relPkFk = await TipoDeRelacionamento.create({
      tipo_de_relacionamento: 'Chave Primária - Chave Estrangeira',
      descricao: 'Relacionamento padrão de integridade referencial'
    });

    // 6. Criar Tabelas e Atributos
    const tabelaClientes = await Tabela.create({
      nome: 'clientes',
      descricao: 'Cadastro principal de clientes ativos na plataforma',
      tipo_de_tabela_id: tipoTabelaTransac._id,
      source_id: sourcePg._id,
      owner_id: marcus._id,
      steward_id: maria._id,
      dba_id: joao._id,
      atributos: [
        {
          nome: 'id',
          descricao: 'Identificador exclusivo do cliente',
          tamanho: null,
          chave_primaria: true,
          chave_estrangeira: false,
          anulavel: false,
          tipo_de_atributo_id: tipoAttrInt._id,
          tipo_de_controle_id: ctrlNormal._id
        },
        {
          nome: 'nome',
          descricao: 'Nome completo do cliente cadastrado',
          tamanho: 150,
          chave_primaria: false,
          chave_estrangeira: false,
          anulavel: false,
          tipo_de_atributo_id: tipoAttrVarchar._id,
          tipo_de_controle_id: ctrlPessoal._id
        },
        {
          nome: 'email',
          descricao: 'E-mail de contato principal',
          tamanho: 100,
          chave_primaria: false,
          chave_estrangeira: false,
          anulavel: false,
          tipo_de_atributo_id: tipoAttrVarchar._id,
          tipo_de_controle_id: ctrlPessoal._id
        }
      ]
    });

    const tabelaPedidos = await Tabela.create({
      nome: 'pedidos',
      descricao: 'Registros das compras efetuadas pelos clientes',
      tipo_de_tabela_id: tipoTabelaTransac._id,
      source_id: sourcePg._id,
      owner_id: marcus._id,
      steward_id: maria._id,
      dba_id: joao._id,
      atributos: [
        {
          nome: 'id',
          descricao: 'Identificador exclusivo do pedido',
          tamanho: null,
          chave_primaria: true,
          chave_estrangeira: false,
          anulavel: false,
          tipo_de_atributo_id: tipoAttrInt._id,
          tipo_de_controle_id: ctrlNormal._id
        },
        {
          nome: 'cliente_id',
          descricao: 'Chave estrangeira apontando para a tabela de clientes',
          tamanho: null,
          chave_primaria: false,
          chave_estrangeira: true,
          anulavel: false,
          tipo_de_atributo_id: tipoAttrInt._id,
          tipo_de_controle_id: ctrlNormal._id
        },
        {
          nome: 'valor_total',
          descricao: 'Soma total do valor do pedido',
          tamanho: null,
          chave_primaria: false,
          chave_estrangeira: false,
          anulavel: false,
          tipo_de_atributo_id: tipoAttrNumeric._id,
          tipo_de_controle_id: ctrlNormal._id
        },
        {
          nome: 'criado_em',
          descricao: 'Data e hora da efetivação da compra',
          tamanho: null,
          chave_primaria: false,
          chave_estrangeira: false,
          anulavel: false,
          tipo_de_atributo_id: tipoAttrDatetime._id,
          tipo_de_controle_id: ctrlNormal._id
        }
      ]
    });

    // 7. Criar Relacionamentos entre Atributos
    const attrClienteIdEmClientes = tabelaClientes.atributos.find(a => a.nome === 'id');
    const attrClienteIdEmPedidos = tabelaPedidos.atributos.find(a => a.nome === 'cliente_id');

    if (attrClienteIdEmClientes && attrClienteIdEmPedidos) {
      await Relacionamento.create({
        tipo_de_relacionamento_id: relPkFk._id,
        tabela_origem_id: tabelaPedidos._id,
        atributo_origem_id: attrClienteIdEmPedidos._id,
        tabela_destino_id: tabelaClientes._id,
        atributo_destino_id: attrClienteIdEmClientes._id
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Banco de dados populado com sucesso!',
      created: {
        statuses: 4,
        colaboradores: 3,
        tags: 4,
        termos: 3
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
