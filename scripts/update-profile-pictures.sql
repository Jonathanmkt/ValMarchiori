-- Função para determinar o gênero pelo primeiro nome
CREATE OR REPLACE FUNCTION get_gender_from_name(name text) 
RETURNS text AS $$
DECLARE
  first_name text;
  normalized_name text;
  male_suffixes text[] := ARRAY['o', 'm', 'r', 's', 'l', 'u'];
  female_suffixes text[] := ARRAY['a', 'e', 'i', 'z', 'h'];
  male_names text[] := ARRAY[
    'joao', 'jose', 'miguel', 'arthur', 'heitor', 'enzo', 'gabriel', 'bernardo', 'davi', 'lucas',
    'matheus', 'pedro', 'rafael', 'felipe', 'guilherme', 'gustavo', 'rodrigo', 'bruno', 'marcos', 'andre',
    'carlos', 'eduardo', 'vinicius', 'leonardo', 'alexandre', 'fernando', 'paulo', 'daniel', 'marcelo', 'ricardo',
    'thiago', 'lucas', 'henrique', 'roberto', 'marcelo', 'carlos', 'marcos', 'daniel'
  ];
  female_names text[] := ARRAY[
    'maria', 'ana', 'sofia', 'alice', 'laura', 'helena', 'valentina', 'isabella', 'manuela',
    'julia', 'heloisa', 'luiza', 'giovanna', 'beatriz', 'mariana', 'larissa', 'amanda',
    'leticia', 'isabela', 'sarah', 'rafaela', 'carolina', 'camila', 'bruna', 'juliana', 'patricia', 'vanessa',
    'fernanda', 'tatiane', 'carol', 'aline', 'adriana', 'lucia', 'sandra', 'cristina', 'marina', 'claudia'
  ];
  i text;
BEGIN
  IF name IS NULL OR name = '' THEN
    RETURN 'unknown';
  END IF;
  
  -- Pega o primeiro nome, remove acentos e converte para minúsculas
  first_name := lower(unaccent(split_part(trim(name), ' ', 1)));
  
  -- Verifica nomes conhecidos
  IF first_name = ANY(male_names) THEN
    RETURN 'male';
  ELSIF first_name = ANY(female_names) THEN
    RETURN 'female';
  END IF;
  
  -- Verifica terminações típicas
  FOREACH i IN ARRAY male_suffixes LOOP
    IF first_name LIKE '%' || i THEN
      RETURN 'male';
    END IF;
  END LOOP;
  
  FOREACH i IN ARRAY female_suffixes LOOP
    IF first_name LIKE '%' || i THEN
      RETURN 'female';
    END IF;
  END LOOP;
  
  RETURN 'unknown';
END;
$$ LANGUAGE plpgsql;

-- Atualiza as fotos de perfil com base no gênero
UPDATE public.leads
SET foto_perfil_url = 
  CASE 
    WHEN get_gender_from_name(nome_completo) = 'female' THEN
      'https://randomuser.me/api/portraits/women/' || (random() * 99)::int || '.jpg'
    ELSE
      'https://randomuser.me/api/portraits/men/' || (random() * 99)::int || '.jpg'
  END
WHERE nome_completo IS NOT NULL;
