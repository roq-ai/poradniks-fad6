import axios from 'axios';
import queryString from 'query-string';
import { HomeOwnerInterface, HomeOwnerGetQueryInterface } from 'interfaces/home-owner';
import { GetQueryInterface } from '../../interfaces';

export const getHomeOwners = async (query?: HomeOwnerGetQueryInterface) => {
  const response = await axios.get(`/api/home-owners${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createHomeOwner = async (homeOwner: HomeOwnerInterface) => {
  const response = await axios.post('/api/home-owners', homeOwner);
  return response.data;
};

export const updateHomeOwnerById = async (id: string, homeOwner: HomeOwnerInterface) => {
  const response = await axios.put(`/api/home-owners/${id}`, homeOwner);
  return response.data;
};

export const getHomeOwnerById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/home-owners/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteHomeOwnerById = async (id: string) => {
  const response = await axios.delete(`/api/home-owners/${id}`);
  return response.data;
};
