const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://vdnyaieqcyyzlbbplkps.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkbnlhaWVxY3l5emxiYnBsa3BzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1ODI5MDAsImV4cCI6MjA5NDE1ODkwMH0.7ETofZqiJrCn1T-H4jK3BeRbvohdS8KgJr8l4yMe1Cw';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // Buscar todos os leads ordenados por data de criação (decrescente)
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar leads:', error);
      return res.status(400).json({ error: error.message });
    }

    console.log('✓ Leads buscados:', data?.length || 0);
    return res.status(200).json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('Erro:', error);
    return res.status(500).json({ error: error.message });
  }
};
