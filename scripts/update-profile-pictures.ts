import { createClient } from '@supabase/supabase-js';
import { getGenderFromName } from '../src/lib/gender-utils';

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateProfilePictures() {
  console.log('Iniciando atualização de fotos de perfil...');
  
  try {
    // Busca todos os leads
    const { data: leads, error } = await supabase
      .from('leads')
      .select('id, nome_completo, foto_perfil_url');

    if (error) {
      console.error('Erro ao buscar leads:', error);
      return;
    }

    if (!leads || leads.length === 0) {
      console.log('Nenhum lead encontrado para atualizar.');
      return;
    }

    console.log(`Encontrados ${leads.length} leads para atualizar.`);
    
    // Atualiza cada lead
    let updatedCount = 0;
    
    for (const lead of leads) {
      if (!lead.nome_completo) continue;
      
      const gender = getGenderFromName(lead.nome_completo);
      const genderParam = gender === 'female' ? 'women' : 'men';
      const randomId = Math.floor(Math.random() * 100);
      const newPhotoUrl = `https://randomuser.me/api/portraits/${genderParam}/${randomId}.jpg`;
      
      // Atualiza o lead
      const { error: updateError } = await supabase
        .from('leads')
        .update({ foto_perfil_url: newPhotoUrl })
        .eq('id', lead.id);
      
      if (updateError) {
        console.error(`Erro ao atualizar lead ${lead.id}:`, updateError);
      } else {
        updatedCount++;
      }
    }
    
    console.log(`Atualização concluída. ${updatedCount} de ${leads.length} leads foram atualizados.`);
    
  } catch (error) {
    console.error('Erro durante a atualização:', error);
  }
}

// Executa a função
updateProfilePictures();
