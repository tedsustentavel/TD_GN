# Especificação de Regras de Negócio e Modelo de Dados: Glossário de Negócios

Este documento descreve o modelo lógico de dados e as regras de negócio para a implementação de um sistema de Glossário de Negócios.

---

## 1. Entidade Principal: Termo (`termo`)

A entidade `termo` é o núcleo do glossário.

* **Identificação:** Cada registro possui um identificador único de chave primária (`id: integer`).
* **Atributos de Conteúdo:**
  * `termo` (`string`): O nome ou título do termo de negócio.
  * `definicao` (`string`): A explicação formal do significado do termo.
  * `origem_definicao` (`string`): A fonte, referência ou documento de onde a definição foi extraída.
* **Integridade Referencial:**
  * Deve obrigatoriamente estar associado a um status (`status_id`).
  * Deve registrar o responsável pelo negócio (`owner_id`) e o guardião do dado (`steward_id`).
* **Auditoria:** Possui os campos `criado_em` e `atualizado_em` (`datetime`).

---

## 2. Governança e Estado (`colaborador` e `status`)

### Status (`status`)
* **Relacionamento com Termo (1:N):** Um status pode pertencer a múltiplos termos; cada termo possui exatamente **um** status.
* **Atributos:** `id` (PK), `status` (`string`), `descricao` (`string`), `criado_em`, `atualizado_em`.

### Colaborador (`colaborador`)
* **Relacionamento com Termo (1:N):** Representa as pessoas da organização. A entidade `termo` relaciona-se com `colaborador` através de duas chaves estrangeiras distintas:
  1. `owner_id` (FK): O Dono do Termo (responsável de negócio).
  2. `steward_id` (FK): O Steward do Termo (guardião de dados).
* **Atributos:** `id` (PK), `nome` (`string`), `criado_em`, `atualizado_em`.

---

## 3. Relacionamentos N:M (Muitos-para-Muitos)

### Etiquetagem (`tag` e `tag_termo`)
* Permite categorizar e agrupar termos de forma flexível.
* Um termo pode receber múltiplas tags e uma tag pode ser atribuída a múltiplos termos.
* **Tabela Principal (`tag`):** `id` (PK), `tag` (`string`), `criado_em`, `atualizado_em`.
* **Tabela Associativa (`tag_termo`):** `id` (PK), `tag_id` (FK), `termo_id` (FK), `criado_em`, `atualizado_em`.

### Termos Relacionados (`termo_relacionado`)
* Estabelece associações autorreferenciadas entre dois termos do glossário (ex: termos correlatos ou dependentes).
* **Estrutura:** `id` (PK), `termo_a_id` (FK), `termo_b_id` (FK), `criado_em`, `atualizado_em`.

---

## 4. Atributos Dependentes e Extensões (Relacionamentos 1:N)

Cada uma das entidades a seguir possui um relacionamento **1:N** com a tabela `termo` (um termo pode ter **zero ou vários** destes registros vinculados via `termo_id`).

1. **Aplicações (`aplicacao`):**
   * Mapeia onde o termo pode ser aplicado ou utilizado (ex: sistemas, relatórios, processos, ferramentas ou áreas de negócio).
   * Campos: `id` (PK), `aplicacao` (`string`), `descricao` (`string`), `termo_id` (FK), `criado_em`, `atualizado_em`.

2. **Acrônimos (`acronimo`):**
   * Registra siglas, abreviações ou acrônimos associados ao termo.
   * Campos: `id` (PK), `acronimo` (`string`), `termo_id` (FK), `criado_em`, `atualizado_em`.

3. **Sinônimos (`sinonimo`):**
   * Registra variações do nome do termo ou termos equivalentes usados no dia a dia.
   * Campos: `id` (PK), `sinonimo` (`string`), `termo_id` (FK), `criado_em`, `atualizado_em`.

4. **Políticas (`politica`):**
   * Armazena diretrizes, regras de governança, conformidade ou restrições de uso vinculadas ao termo.
   * Campos: `id` (PK), `politica` (`string`), `descricao` (`string`), `termo_id` (FK), `criado_em`, `atualizado_em`.

5. **Regras de Cálculo (`regra_de_calculo`):**
   * Descreve fórmulas, lógicas analíticas ou algoritmos utilizados para calcular a métrica/termo.
   * Campos: `id` (PK), `regra_de_calculo` (`string`), `termo_id` (FK), `criado_em`, `atualizado_em`.

6. **Exemplos (`exemplo`):**
   * Casos práticos ou cenários reais de aplicação do termo para facilitar a compreensão.
   * Campos: `id` (PK), `exemplo` (`string`), `termo_id` (FK), `criado_em`, `atualizado_em`.

7. **Anotações (`anotacao`):**
   * Notas de rodapé, histórico de discussões ou observações gerais.
   * Campos: `id` (PK), `anotacao` (`string`), `termo_id` (FK), `criado_em`, `atualizado_em`.

---

## 5. Padrões Globais do Banco de Dados

1. **Chaves Primárias:** Todas as tabelas utilizam um identificador numérico incremental `id` (integer) como PK.
2. **Rastreabilidade/Auditoria:** Todas as entidades do modelo contêm obrigatoriamente as colunas `criado_em` (`datetime`) e `atualizado_em` (`datetime`).
3. **Tipagem das Chaves Estrangeiras:** Os campos `termo_id` nas tabelas filhas/extensões devem ser mapeados adequadamente para o tipo do `id` da tabela `termo` (`integer`).