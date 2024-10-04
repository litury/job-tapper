import axios, { AxiosError } from 'axios';
import dotenv from 'dotenv';
import querystring from 'querystring';
import FormData from 'form-data';

dotenv.config();

export const hhService = {
  async getAccessToken(code: string): Promise<any> {
    const data = {
      grant_type: 'authorization_code',
      client_id: process.env.HH_CLIENT_ID,
      client_secret: process.env.HH_CLIENT_SECRET,
      redirect_uri: process.env.HH_REDIRECT_URI,
      code: code
    };

    try {
      const response = await axios.post('https://hh.ru/oauth/token', querystring.stringify(data), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'JobTapper/1.0 (api@jobtapper.com)'
        }
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error getting access token:', error.response?.data || error.message);
      } else {
        console.error('Error getting access token:', error);
      }
      throw error;
    }
  },

  async getUserInfo(accessToken: string): Promise<any> {
    const response = await axios.get(`${process.env.HH_API_URL}/me`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response.data;
  },

  async getResume(accessToken: string): Promise<any> {
    const response = await axios.get(`${process.env.HH_API_URL}/resumes/mine`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    console.log('получили резюме')
    console.log(response.data)
    return response.data;
  },

  async searchVacancies(accessToken: string, searchParams: any): Promise<any[]> {
    const response = await axios.get(`${process.env.HH_API_URL}/vacancies`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: searchParams
    });
    return response.data.items;
  },

  async getSimilarVacancies(accessToken: string, resumeId: string): Promise<any> {
    try {
      const response = await axios.get(`${process.env.HH_API_URL}/resumes/${resumeId}/similar_vacancies`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'User-Agent': 'JobTapper/1.0 (api@jobtapper.com)'
        },
        params: {
          per_page: 100  // Получаем максимальное количество вакансий
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting similar vacancies:', error);
      throw error;
    }
  },

  async applyToVacancy(accessToken: string, vacancyId: string, resumeId: string, message: string | null = null): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('vacancy_id', vacancyId);
      formData.append('resume_id', resumeId);
      if (message) {
        formData.append('message', message);
      }

      const response = await axios.post(`${process.env.HH_API_URL}/negotiations`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'User-Agent': 'JobTapper/1.0 (api@jobtapper.com)',
          ...formData.getHeaders()
        }
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      console.log('Response data:', response.data);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error applying to vacancy:', error.response?.data);
        throw new Error(JSON.stringify(error.response?.data));
      } else {
        console.error('Error applying to vacancy:', error);
        throw error;
      }
    }
  },

  async getResumeStats(accessToken: string, resumeId: string): Promise<any> {
    try {
      const response = await axios.get(`${process.env.HH_API_URL}/resumes/${resumeId}/stats`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'User-Agent': 'JobTapper/1.0 (api@jobtapper.com)'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting resume stats:', error);
      throw error;
    }
  },

  async getResumeViews(accessToken: string, resumeId: string): Promise<any> {
    try {
      const response = await axios.get(`${process.env.HH_API_URL}/resumes/${resumeId}/views`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'User-Agent': 'JobTapper/1.0 (api@jobtapper.com)'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting resume views:', error);
      throw error;
    }
  },

  async getResumeSimilarVacancies(accessToken: string, resumeId: string): Promise<any> {
    try {
      const response = await axios.get(`${process.env.HH_API_URL}/resumes/${resumeId}/similar_vacancies`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'User-Agent': 'JobTapper/1.0 (api@jobtapper.com)'
        },
        params: {
          per_page: 100,
          page: 0
        }
      });
      
      const allVacancies = [];
      let currentPage = 0;
      const totalPages = Math.ceil(response.data.found / 100);

      while (currentPage < totalPages) {
        const pageResponse = await axios.get(`${process.env.HH_API_URL}/resumes/${resumeId}/similar_vacancies`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'User-Agent': 'JobTapper/1.0 (api@jobtapper.com)'
          },
          params: {
            per_page: 100,
            page: currentPage
          }
        });
        allVacancies.push(...pageResponse.data.items);
        currentPage++;
      }

      const simplifiedVacancies = allVacancies.map((vacancy: any) => ({
        id: vacancy.id,
        name: vacancy.name,
        alternate_url: vacancy.alternate_url,
        has_test: vacancy.has_test,
        response_letter_required: vacancy.response_letter_required,
        salary: vacancy.salary
      }));

      console.log(`Similar vacancies for resume ${resumeId}:`, {
        found: response.data.found,
        itemsCount: simplifiedVacancies.length
      });

      return {
        items: simplifiedVacancies,
        found: response.data.found
      };
    } catch (error) {
      console.error(`Error getting similar vacancies for resume ${resumeId}:`, error);
      throw error;
    }
  },

  async getResumeStatus(accessToken: string, resumeId: string): Promise<any> {
    try {
      const response = await axios.get(`${process.env.HH_API_URL}/resumes/${resumeId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'User-Agent': 'JobTapper/1.0 (api@jobtapper.com)'
        }
      });
      return { status: response.data.status };
    } catch (error) {
      console.error('Error getting resume status:', error);
      throw error;
    }
  },

  async getTokens(code: string) {
    const clientId = process.env.HH_CLIENT_ID;
    const clientSecret = process.env.HH_CLIENT_SECRET;
    const redirectUri = process.env.HH_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      throw new Error('Missing required environment variables');
    }

    const data = new URLSearchParams();
    data.append('grant_type', 'authorization_code');
    data.append('client_id', clientId);
    data.append('client_secret', clientSecret);
    data.append('code', code);
    data.append('redirect_uri', redirectUri);

    try {
      const response = await axios.post('https://hh.ru/oauth/token', data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'JobTapper/1.0 (api@jobtapper.com)'
        }
      });
      console.log('Token response:', response.data);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error('Error getting tokens:', error.response?.data || error.message);
      } else if (error instanceof Error) {
        console.error('Error getting tokens:', error.message);
      } else {
        console.error('Unknown error getting tokens');
      }
      throw error;
    }
  }
}; // Убедитесь, что эта закрывающая фигурная скобка есть в конце файла