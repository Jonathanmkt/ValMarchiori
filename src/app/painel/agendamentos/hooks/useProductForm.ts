'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { ProductObservable } from '../store/productObservable'
import { ProdutoState } from '../types/produtos-types'
import { produtoFormSchema, type ProdutoData, ProdutoStatus } from '../types/form-schema'
import logger from '@/lib/utils/logger'
import { useFetchOptions } from './useFetchOptions'
import { criarProdutoComEstoque } from '@/app/actions/produto/criar-produto-com-estoque.action'

type Option = {
  id: string
  nome: string
}

// Valores iniciais baseados no schema
const defaultValues: ProdutoData = {
  // Informações básicas
  nome: '',
  descricao: '',
  codigo_sku: '',
  estoque_inicial: 1,  // Campo obrigatório para criar produto
  categorias: [] as string[],
  tags: [] as string[],
  publico_alvo: [] as string[],
  ocasioes: [] as string[],
  garantia: '0',
  condicao_frete: [] as string[],
  materiais: [] as string[],
  
  // Preços e promoções
  preco_custo: 0,
  preco_venda: 0,
  preco_promocional: 0,
  inicio_promocao: undefined,
  fim_promocao: undefined,
  
  // Características físicas
  peso: 0,
  dimensoes: {
    altura: 0,
    largura: 0,
    profundidade: 0
  },
  imagens: [] as string[],  // Array de URLs das imagens
  especificacoes: {},
  
  // Status e configurações
  status: ProdutoStatus.ATIVO,
  destaque: false
}

export function useProductForm() {
  // Buscar dados das tabelas relacionais no topo do hook
  const { 
    categories, 
    tags, 
    occasions, 
    targetAudience, 
    freightConditions, 
    materials 
  } = useFetchOptions();

  const form = useForm<ProdutoData>({
    defaultValues,
    resolver: zodResolver(produtoFormSchema)
  })

  // Resetar o formulário quando for aberto novamente
  useEffect(() => {
    const subscription = ProductObservable.create().state$.subscribe((state) => {
      if (state === ProdutoState.INICIAL) {
        logger.info('[useProductForm] Resetando formulário, estado atual:', state)
        form.reset(defaultValues)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [form])

  // Função para preparar os dados do formulário
  const prepararDadosFormulario = (options?: {
    categories?: Option[],
    tags?: Option[],
    occasions?: Option[],
    targetAudience?: Option[],
    freightConditions?: Option[],
    materials?: Option[]
  }) => {
    const dadosFormulario = form.getValues()
    
    // Função auxiliar para buscar nomes dos itens selecionados
    const getNomesItens = (ids: string[] = [], options: Option[] = []) => {
      return ids.map(id => {
        const item = options.find(opt => opt.id === id)
        return item?.nome || id
      })
    }

    // Logar os nomes dos itens selecionados
    if (options) {
      logger.info('Itens selecionados:', {
        categorias: getNomesItens(dadosFormulario.categorias, options.categories),
        tags: getNomesItens(dadosFormulario.tags, options.tags),
        ocasioes: getNomesItens(dadosFormulario.ocasioes, options.occasions),
        publico_alvo: getNomesItens(dadosFormulario.publico_alvo, options.targetAudience),
        condicao_frete: getNomesItens(dadosFormulario.condicao_frete, options.freightConditions),
        materiais: getNomesItens(dadosFormulario.materiais, options.materials)
      })
    }
    
    // Garante que todos os campos estão presentes com valores padrão se necessário
    const dadosTratados = {
      // Campos básicos
      nome: dadosFormulario.nome || '',
      descricao: dadosFormulario.descricao || '',
      codigo_sku: dadosFormulario.codigo_sku || '',
      estoque_inicial: Number(dadosFormulario.estoque_inicial || 1),
      status: dadosFormulario.status || ProdutoStatus.ATIVO,
      
      // Preços
      preco_custo: Number(dadosFormulario.preco_custo || 0),
      preco_venda: Number(dadosFormulario.preco_venda || 0),
      
      // Características físicas
      peso: Number(dadosFormulario.peso || 0),
      dimensoes: {
        altura: Number(dadosFormulario.dimensoes?.altura || 0),
        largura: Number(dadosFormulario.dimensoes?.largura || 0),
        profundidade: Number(dadosFormulario.dimensoes?.profundidade || 0)
      },
      
      // Convertendo IDs para números antes de enviar
      categorias: (dadosFormulario.categorias || []).map(Number),
      tags: (dadosFormulario.tags || []).map(Number),
      publico_alvo: (dadosFormulario.publico_alvo || []).map(Number),
      ocasioes: (dadosFormulario.ocasioes || []).map(Number),
      condicao_frete: (dadosFormulario.condicao_frete || []).map(Number),
      materiais: (dadosFormulario.materiais || []).map(Number),
      
      // Outros campos
      garantia: dadosFormulario.garantia || '0',
      imagens: dadosFormulario.imagens || [],
      destaque: Boolean(dadosFormulario.destaque)
    }

    logger.info('[useProductForm] Dados do formulário preparados:', dadosTratados)

    return dadosTratados
  }

  // Função que submete os dados diretamente para a action
  const submitForm = async () => {
    try {
      const dadosTratados = prepararDadosFormulario({
        categories,
        tags,
        occasions,
        targetAudience,
        freightConditions,
        materials
      })
      return await criarProdutoComEstoque(dadosTratados)
    } catch (error) {
      logger.error('[useProductForm] Erro ao submeter formulário:', error)
      throw error
    }
  }

  return { 
    form,
    submitForm
  }
}
