import axios from 'axios';
import type { Note, NoteTag } from '../types/note';

const API = 'https://notehub-public.goit.study/api';
const token = import.meta.env.VITE_NOTEHUB_TOKEN;

const headers = {
  Authorization: `Bearer ${token}`,
};

// src/services/noteService.ts

export interface FetchNotesResponse {
  notes: Note[];
  totalItems: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export const fetchNotes = async (
  page: number,
  search?: string
): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = {
    page,
    perPage: 12,
  };

  if (search?.trim()) {
    params.search = search;
  }

  const { data } = await axios.get<FetchNotesResponse>(`${API}/notes`, { headers, params });
  return data;
};

export const createNote = async (
  note: { title: string; content: string; tag: NoteTag }
): Promise<Note> => {
  const { data } = await axios.post<Note>(`${API}/notes`, note, { headers });
  return data;
};

export const deleteNote = async (id: number): Promise<Note> => {
  const { data } = await axios.delete<Note>(`${API}/notes/${id}`, { headers });
  return data;
};