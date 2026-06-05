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
    console.log('🔍 Tentando conectar ao Supabase...');
    console.log('URL:', SUPABASE_URL);

    // Tentar buscar da tabela 'leads' ordenado por data_criacao
    const response = await fetch(`${SUPABASE_URL}/rest/v1/leads?order=data_criacao.desc`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });

    console.log('📊 Status da resposta:', response.status);

    const data = await response.json();
    console.log('📦 Dados recebidos:', data);

    if (!response.ok) {
      console.error('❌ Erro Supabase:', data);
      // Se a tabela não existe, retornar array vazio
      return res.status(200).json({
        success: false,
        data: [],
        message: 'Nenhum dado disponível ainda',
        error: data
      });
    }

    console.log('✓ Leads buscados com sucesso:', Array.isArray(data) ? data.length : 0);
    return res.status(200).json({
      success: true,
      data: Array.isArray(data) ? data : [],
      count: Array.isArray(data) ? data.length : 0
    });
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
    return res.status(200).json({
      success: false,
      data: [],
      error: error.message
    });
  }
};
