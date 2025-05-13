'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Option = {
  id: number // ID inteiro
  nome: string
}

export function useFetchOptions() {
  const [categories, setCategories] = useState<Option[]>([])
  const [tags, setTags] = useState<Option[]>([])
  const [occasions, setOccasions] = useState<Option[]>([])
  const [targetAudience, setTargetAudience] = useState<Option[]>([])
  const [freightConditions, setFreightConditions] = useState<Option[]>([])
  const [materials, setMaterials] = useState<Option[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAllOptions = async () => {
      setLoading(true)
      setError(null)
      const supabase = createClient()

      try {
        // Buscar categorias
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categorias')
          .select('id, nome')
          .eq('ativo', true)

        if (categoriesError) throw new Error(`Erro ao buscar categorias: ${categoriesError.message}`)
        console.log('Dados brutos das categorias:', categoriesData)
        setCategories(categoriesData || [])

        // Buscar tags
        const { data: tagsData, error: tagsError } = await supabase
          .from('tags')
          .select('id, nome')
          .eq('ativo', true)

        if (tagsError) throw new Error(`Erro ao buscar tags: ${tagsError.message}`)
        setTags(tagsData || [])

        // Buscar ocasiões
        const { data: occasionsData, error: occasionsError } = await supabase
          .from('ocasioes')
          .select('id, nome')
          .eq('ativo', true)

        if (occasionsError) throw new Error(`Erro ao buscar ocasiões: ${occasionsError.message}`)
        setOccasions(occasionsData || [])

        // Buscar público-alvo
        const { data: audienceData, error: audienceError } = await supabase
          .from('publico_alvo')
          .select('id, nome')
          .eq('ativo', true)

        if (audienceError) throw new Error(`Erro ao buscar público-alvo: ${audienceError.message}`)
        setTargetAudience(audienceData || [])

        // Buscar condições de frete
        const { data: freightData, error: freightError } = await supabase
          .from('condicao_frete')
          .select('id, nome')
          .eq('ativo', true)

        if (freightError) throw new Error(`Erro ao buscar condições de frete: ${freightError.message}`)
        setFreightConditions(freightData || [])

        // Buscar materiais
        const { data: materialsData, error: materialsError } = await supabase
          .from('materiais')
          .select('id, nome')
          .eq('ativo', true)

        if (materialsError) throw new Error(`Erro ao buscar materiais: ${materialsError.message}`)
        setMaterials(materialsData || [])

      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erro desconhecido ao buscar opções')
      } finally {
        setLoading(false)
      }
    }

    fetchAllOptions()
  }, [])

  return {
    categories,
    tags,
    occasions,
    targetAudience,
    freightConditions,
    materials,
    loading,
    error
  }
}
