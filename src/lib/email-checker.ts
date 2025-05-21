export async function checkEmail(email: string) {
  const apiKey = import.meta.env.VITE_EMAIL_CHECKER_API_KEY || process.env.EMAIL_CHECKER_API_KEY;
  if (!apiKey) {
    throw new Error('API key not configured');
  }

  const url = `https://api.usebouncer.com/v1.1/email/verify?email=${encodeURIComponent(email)}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Erro da API Bouncer:", errorBody);
      throw new Error(`Erro na API Bouncer: ${errorBody}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao chamar o Bouncer:", error);
    throw error;
  }
} 