'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Option = {
  id: number | string
  nome: string
  codigo?: string
}

export function useFetchAssociadosOptions() {
  const [situacoes, setSituacoes] = useState<Option[]>([])
  const [tiposDocumento, setTiposDocumento] = useState<Option[]>([])
  const [orgaosEmissores, setOrgaosEmissores] = useState<Option[]>([])
  const [estados, setEstados] = useState<Option[]>([])
  const [categorias, setCategorias] = useState<Option[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAllOptions = async () => {
      setLoading(true)
      setError(null)
      const supabase = createClient()

      try {
        // Buscar situações de associados
        const { data: situacoesData, error: situacoesError } = await supabase
          .from('associado_situacoes')
          .select('id, nome, codigo')
          .eq('ativo', true)

        if (situacoesError) throw new Error(`Erro ao buscar situações: ${situacoesError.message}`)
        setSituacoes(situacoesData || [])

        // Buscar tipos de documento
        const { data: tiposDocumentoData, error: tiposDocumentoError } = await supabase
          .from('tipo_documento')
          .select('id, nome')
          .eq('ativo', true)

        if (tiposDocumentoError) throw new Error(`Erro ao buscar tipos de documento: ${tiposDocumentoError.message}`)
        setTiposDocumento(tiposDocumentoData || [])

        // Buscar órgãos emissores
        const { data: orgaosEmissoresData, error: orgaosEmissoresError } = await supabase
          .from('orgaos_emissores')
          .select('id, nome, codigo')
          .eq('ativo', true)

        if (orgaosEmissoresError) throw new Error(`Erro ao buscar órgãos emissores: ${orgaosEmissoresError.message}`)
        setOrgaosEmissores(orgaosEmissoresData || [])

        // Buscar estados brasileiros (UFs)
        const { data: estadosData, error: estadosError } = await supabase
          .from('estados')
          .select('id, nome, codigo')
          .order('nome')

        if (estadosError) throw new Error(`Erro ao buscar estados: ${estadosError.message}`)
        setEstados(estadosData || [])

        // Buscar categorias de associados
        const { data: categoriasData, error: categoriasError } = await supabase
          .from('associado_categorias')
          .select('id, nome')
          .eq('ativo', true)

        if (categoriasError) throw new Error(`Erro ao buscar categorias: ${categoriasError.message}`)
        setCategorias(categoriasData || [])

      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erro desconhecido ao buscar opções')
      } finally {
        setLoading(false)
      }
    }

    fetchAllOptions()
  }, [])

  // Opções estáticas 
  const estadoCivil = [
    { id: 'solteiro', nome: 'Solteiro(a)' },
    { id: 'casado', nome: 'Casado(a)' },
    { id: 'divorciado', nome: 'Divorciado(a)' },
    { id: 'viuvo', nome: 'Viúvo(a)' },
    { id: 'uniao_estavel', nome: 'União Estável' },
    { id: 'separado', nome: 'Separado(a)' }
  ]

  const sexo = [
    { id: 'masculino', nome: 'Masculino' },
    { id: 'feminino', nome: 'Feminino' },
    { id: 'nao_informado', nome: 'Não informado' }
  ]

  return {
    situacoes,
    tiposDocumento,
    orgaosEmissores,
    estados,
    categorias,
    estadoCivil,
    sexo,
    loading,
    error
  }
}
