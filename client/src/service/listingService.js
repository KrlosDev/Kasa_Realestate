import axios from 'axios';
import { BASE_URL } from '../constants';

const API_URL = `${BASE_URL}/api/list`;

export const getLicenseTypes = async () => {
  try {
    const response = await axios.get(`${API_URL}/license-types`);
    return response.data;
  } catch (error) {
    console.error('Error fetching license types:', error);
    throw error;
  }
};

export const getRoles = async (isLanding = false) => {
  try {
    const response = await axios.get(`${API_URL}/roles`, {
      params: { isLanding: isLanding.toString() }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};
