const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://vdnyaieqcyyzlbbplkps.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkbnlhaWVxY3l5emxiYnBsa3BzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1ODI5MDAsImV4cCI6MjA5NDE1ODkwMH0.7ETofZqiJrCn1T-H4jK3BeRbvohdS8KgJr8l4yMe1Cw';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    const formData = req.body;

    console.log('Recebendo dados:', formData);

    // Inserir dados no Supabase
    const { data, error } = await supabase
      .from('leads')
      .insert([formData]);

    if (error) {
      console.error('Erro Supabase:', error);
      return res.status(400).json({ error: error.message });
    }

    console.log('✓ Dados salvos no Supabase:', data);
    return res.status(200).json({
      success: true,
      message: 'Dados salvos com sucesso',
      data
    });
  } catch (error) {
    console.error('Erro:', error);
    return res.status(500).json({ error: error.message });
  }
};
