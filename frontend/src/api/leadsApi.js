import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

export async function fetchLeads(params = {}) {
  const { data } = await api.get('/leads', { params });
  return data;
}

export async function fetchAllLeads() {
  const { data } = await api.get('/leads/all');
  return data;
}

export async function fetchLeadById(id) {
  const { data } = await api.get(`/leads/${id}`);
  return data;
}

export async function createLead(payload) {
  const { data } = await api.post('/leads', payload);
  return data;
}

export async function updateLead(id, payload) {
  const { data } = await api.put(`/leads/${id}`, payload);
  return data;
}

export async function patchLeadStatus(id, status) {
  const { data } = await api.patch(`/leads/${id}/status`, { status });
  return data;
}

export async function deleteLead(id) {
  const { data } = await api.delete(`/leads/${id}`);
  return data;
}

export function getApiErrorMessage(error, fallback = 'Something went wrong') {
  const msg = error.response?.data?.message;
  const errors = error.response?.data?.errors;
  if (errors?.length) {
    return errors.map((e) => e.message).join('. ');
  }
  return msg || error.message || fallback;
}
